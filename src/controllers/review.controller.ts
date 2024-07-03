import type { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse, getIdFromPayload } from '../utils'
import { notiRepo, reviewRepo } from '../repositories'
import type { RequestPayload } from '../types'
import { uid } from 'uid'
import { messages } from '../constants'

export const createReview = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const newReview = await reviewRepo.createReview({ ...req.body, userId })

    return res.status(httpStatus.OK).json(getApiResponse({ data: newReview }))
  } catch (error) {
    next(error)
  }
}

export const getOverviewRates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params
    const results = await reviewRepo.getOverviewRates({ itemId })

    return res.status(httpStatus.OK).json(getApiResponse({ data: results }))
  } catch (error) {
    next(error)
  }
}

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId } = req.params
    const { filter } = req.query
    const results = await reviewRepo.getReviews({ itemId }, filter as string)

    return res.status(httpStatus.OK).json(getApiResponse({ data: results }))
  } catch (error) {
    next(error)
  }
}

export const getProfileReviews = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = getIdFromPayload(req.payload)
    const { userId } = req.params
    const results = await reviewRepo.getProfileReviews({ userId })

    const reviewDTOs: any[] = []

    for (const review of results) {
      reviewDTOs.push(getReviewDTO(id, review))
    }

    return res.status(httpStatus.OK).json(getApiResponse({ data: reviewDTOs }))
  } catch (error) {
    next(error)
  }
}

export const getReview = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const { id } = req.params
    const results = await reviewRepo.getProfileReviews({ id })

    if (results.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
    }

    const review = getReviewDTO(userId, results[0])

    return res.status(httpStatus.OK).json(getApiResponse({ data: review }))
  } catch (error) {
    next(error)
  }
}

export const interactReview = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const reviewId = req.params.id
    const userId = getIdFromPayload(req.payload)
    const like: boolean = req.body.like

    if (like) {
      await reviewRepo.createInteract({ id: uid(), reviewId, userId })
      // send notificaiton to user
      void notiRepo.createReviewInteractNoti(userId, reviewId)
    } else {
      await reviewRepo.removeInteract({ reviewId, userId })
    }
    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const getReviewDTO = (userId: string, review: any): any => {
  const { likes, ...rest } = review
  return {
    ...rest,
    interact: {
      likes: likes.length,
      liked: likes.includes(userId)
    }
  }
}
