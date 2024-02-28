import { type Request, type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'

import { userRepo } from '../repositories'
import { getApiResponse } from '../utils'

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

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(httpStatus.OK).json(getApiResponse())
  } catch (error) {
    next(error)
  }
}
