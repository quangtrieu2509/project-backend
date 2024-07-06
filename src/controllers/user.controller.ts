import type { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'

import { notiRepo, userRepo } from '../repositories'
import { getApiResponse, getIdFromPayload } from '../utils'
import { messages } from '../constants'
import type { RequestPayload } from '../types'
import { getTripDTO } from './trip.controller'
import { getReviewDTO } from './review.controller'
import { uid } from 'uid'

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
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.NOT_FOUND))
    }
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = getIdFromPayload(req.payload)
    const user = await userRepo.updateUser({ id }, req.body)
    if (user !== null) {
      return res
        .status(httpStatus.OK)
        .json(getApiResponse(messages.OK))
    } else {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.NOT_FOUND))
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
      await userRepo.createFollow({ id: uid(), followerId, followingId })
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

export const getActivities = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const { id } = req.params

    if (id === undefined) {
      return res
        .status(httpStatus.OK)
        .json(getApiResponse({ data: [] }))
    }

    const results = await userRepo.getActivities(id)

    const [trips, reviews] = results

    const tripDTOs: any[] = []
    const reviewDTOs: any[] = []

    for (const trip of trips) {
      trip.type = 'trip'
      tripDTOs.push(getTripDTO(userId, trip))
    }

    for (const review of reviews) {
      review.type = 'review'
      reviewDTOs.push(getReviewDTO(userId, review))
    }

    return res
      .status(httpStatus.OK)
      .json(getApiResponse({
        data: [tripDTOs, reviewDTOs]
          .flat()
          .sort((a, b) => b.createdAt - a.createdAt)
      }))
  } catch (error) {
    next(error)
  }
}

export const getNewFeeds = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)

    const results = await userRepo.getNewFeeds(userId)

    const [trips, reviews] = results

    const tripDTOs: any[] = []
    const reviewDTOs: any[] = []

    for (const trip of trips) {
      trip.type = 'trip'
      tripDTOs.push(getTripDTO(userId, trip))
    }

    for (const review of reviews) {
      review.type = 'review'
      reviewDTOs.push(getReviewDTO(userId, review))
    }

    return res
      .status(httpStatus.OK)
      .json(getApiResponse({
        data: [tripDTOs, reviewDTOs]
          .flat()
          .sort((a, b) => b.updatedAt - a.updatedAt)
      }))
  } catch (error) {
    next(error)
  }
}

const getUserDTO = (user: any) => {
  const { password, email, phoneNumber, accountType, role, isActive, ...userDTO } = user
  return userDTO
}
