import type { NextFunction, Request, Response } from 'express'
import { locationRepo } from '../repositories'
import httpStatus from 'http-status'
import { getApiResponse } from '../utils'
import { uid } from 'uid'
import { messages } from '../constants'

export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newLoc = await locationRepo.createLocation({ id: uid(), ...req.body })
    return res.status(httpStatus.OK).json(getApiResponse({ data: newLoc }))
  } catch (error) {
    next(error)
  }
}

export const getLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params
    const location = await locationRepo.getLocation({ slug })

    if (location === null) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
    }

    return res.status(httpStatus.OK).json(getApiResponse({ data: location }))
  } catch (error) {
    next(error)
  }
}

export const getBreadcrumb = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.params
    const breadcrumb = await locationRepo.getBreadcrumb({ slug })

    if (breadcrumb === null) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
    }

    return res.status(httpStatus.OK).json(getApiResponse({ data: breadcrumb }))
  } catch (error) {
    next(error)
  }
}

export const searchLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q } = req.query
    const locations = await locationRepo.searchLocations(q as string)
    return res
      .status(httpStatus.OK)
      .json(getApiResponse(
        {
          total: locations.length,
          data: locations
        })
      )
  } catch (error) {
    next(error)
  }
}
