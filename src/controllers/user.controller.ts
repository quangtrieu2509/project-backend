import type { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { v4 } from 'uuid'

import { notiRepo, userRepo } from '../repositories'
import { getApiResponse, getIdFromPayload } from '../utils'
import { messages } from '../constants'
import type { RequestPayload } from '../types'

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createUser = await userRepo.createUser(req.body)
    res.status(httpStatus.OK).json(getApiResponse({ data: createUser }))
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userRepo.getProfile({ id: req.params.id })
    if (user !== null) {
      return res
        .status(httpStatus.OK)
        .json(getApiResponse({ data: getUserDTO(user) }))
    } else {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.INFO_NOT_EXIST))
    }
  } catch (error) {
    next(error)
  }
}

export const interactUser = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const followingId = req.params.id
    const followerId = getIdFromPayload(req.payload)
    const follow: boolean = req.body.follow
    const existed = await userRepo.checkExisted({ id: followingId })
    if (existed === null) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json(getApiResponse(messages.INFO_NOT_EXIST))
    }

    if (follow) {
      await userRepo.createFollow({ id: v4(), followerId, followingId })
      void notiRepo.createUserInteractNoti(followerId, followingId)
    } else {
      await userRepo.removeFollow({ followerId, followingId })
    }
    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const getInteractInfo = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const { id, type } = req.params

    const userList = await userRepo.getInteractInfo(id, userId, type)

    return res.status(httpStatus.OK).json(getApiResponse({ data: userList }))
  } catch (error) {
    next(error)
  }
}

const getUserDTO = (user: any) => {
  const { password, email, phoneNumber, accountType, role, isActive, ...userDTO } = user
  return userDTO
}
