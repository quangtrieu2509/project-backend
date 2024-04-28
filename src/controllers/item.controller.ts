import type { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse } from '../utils'
import { uid } from 'uid'
import { itemRepo } from '../repositories'

export const createItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newItem = await itemRepo.createItem({ id: uid(), ...req.body })
    return res.status(httpStatus.OK).json(getApiResponse({ data: newItem }))
  } catch (error) {
    next(error)
  }
}

// export const getLocation = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { slug } = req.params
//     const location = await locationRepo.getLocation({ slug })

//     if (location === null) {
//       return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
//     }

//     return res.status(httpStatus.OK).json(getApiResponse({ data: location }))
//   } catch (error) {
//     next(error)
//   }
// }
