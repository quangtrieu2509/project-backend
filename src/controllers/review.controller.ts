import type { NextFunction, Response } from 'express'
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
    const userId = getIdFromPayload(req)
    const newReview = await reviewRepo.createReview({ ...req.body, userId })

    return res.status(httpStatus.OK).json(getApiResponse({ data: newReview }))
  } catch (error) {
    next(error)
  }
}
