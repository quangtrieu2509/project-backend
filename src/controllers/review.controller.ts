import type { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse, getIdFromPayload } from '../utils'
import { reviewRepo } from '../repositories'
import type { RequestPayload } from '../types'

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
