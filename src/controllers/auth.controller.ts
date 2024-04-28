import type { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { CronJob } from 'cron'
import { uid } from 'uid'

import { userRepo } from '../repositories'
import { createToken, getApiResponse } from '../utils'
import { messages, roles, accountTypes } from '../constants'
import type { IGoogleUser, IUser, RequestPayload } from '../types'
import { mailer } from '../mailer'
import { accessTokenSettings } from '../configs'

export const signInByGoogle = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { email, given_name, family_name, picture } = req.payload as IGoogleUser
    const userCheck = await userRepo.getUser({ email })

    // if email do not exist yet
    if (userCheck == null) {
      const newUser: IUser = {
        id: uid(),
        email,
        profileImage: picture,
        givenName: given_name,
        familyName: family_name,
        accountType: accountTypes.GOOGLE,
        role: roles.USER,
        isActive: true
      }

      const user = await userRepo.createUser(newUser)

      const { id, role } = user
      const accessToken = createToken({ id, email, role })

      return res
        .status(httpStatus.OK)
        .json(getApiResponse({ data: { user: getUserDTO(user), accessToken } }))
    // if email exist already
    } else {
      const { id, email, role } = userCheck
      const accessToken = createToken({ id, email, role })

      // if account type is "email", then switch to type "google"
      if (userCheck.accountType === accountTypes.EMAIL) {
        await userRepo.updateUser({ id: userCheck.id }, { accountType: accountTypes.GOOGLE })
        return res
          .status(httpStatus.OK)
          .json(getApiResponse({ ...messages.CONNECT_GOOGLE_ACCOUNT, data: { user: getUserDTO(userCheck), accessToken } }))
      } else {
        return res
          .status(httpStatus.OK)
          .json(getApiResponse({ data: { user: getUserDTO(userCheck), accessToken } }))
      }
    }
  } catch (error) {
    next(error)
  }
}

export const signInByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const userCheck = await userRepo.getUser({ email })
    const isMatch = await bcrypt.compare(password, userCheck?.password ?? '')

    // if email existed
    if (userCheck !== null && isMatch) {
      // if email is activated
      if (userCheck.isActive) {
        const { id, email, role } = userCheck
        const accessToken = createToken({ id, email, role })
        return res
          .status(httpStatus.OK)
          .json(getApiResponse({ data: { user: getUserDTO(userCheck), accessToken } }))
      } else {
        return res
          .status(httpStatus.OK)
          .json(getApiResponse(messages.ACTIVATE_EMAIL))
      }

    // if email did not exist
    } else {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.SIGN_IN_ERROR))
    }
  } catch (error) {
    next(error)
  }
}

export const signUpByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body
    const userCheck = await userRepo.getUser({ email: body.email })

    if (userCheck == null) {
      const newUser = {
        ...body,
        id: uid(),
        accountType: accountTypes.EMAIL,
        role: roles.USER
      }
      const user = await userRepo.createUser(newUser)

      const activeToken = createToken({ id: user.id }, 10 * 60) // 10 mins
      mailer.sendActiveMail(user.email, user.familyName, activeToken)

      // after a specific time, delete if user did not activate
      const time = new Date(Date.now() + 15 * 60 * 1000) // 15 mins
      const cron = new CronJob(time, async () => {
        const userCheck = await userRepo.getUser({ id: user.id })
        if (userCheck !== null && !userCheck.isActive) {
          await userRepo.removeUser({ id: user.id })
        }
      })
      cron.start()

      return res
        .status(httpStatus.OK)
        .json(getApiResponse({ ...messages.ACCEPT_EMAIL, data: { user: getUserDTO(user) } }))
    } else {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.EMAIL_EXISTED))
    }
  } catch (error) {
    next(error)
  }
}

export const activateEmail = async (
  req: Request,
  res: Response
) => {
  try {
    const { activeToken } = req.params

    const payload = jwt.verify(activeToken, accessTokenSettings.secret)

    if (typeof payload === 'object' && 'id' in payload) {
      await userRepo.updateUser({ id: payload.id }, { isActive: true })
      return res
        .status(httpStatus.OK)
        .json(getApiResponse(messages.OK))
    } else {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(getApiResponse(messages.ACCESS_TOKEN_INVALID))
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(getApiResponse(messages.ACCESS_TOKEN_EXPIRED))
    }
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(getApiResponse(messages.ACCESS_TOKEN_INVALID))
  }
}

const getUserDTO = (user: IUser) => {
  const { password, role, isActive, links, bio, ...userDTO } = user
  return userDTO
}
