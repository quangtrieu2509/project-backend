import type { NextFunction, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse, getIdFromPayload } from '../utils'
import { tripRepo } from '../repositories'
import { privacies } from '../constants'
import type { RequestPayload } from '../types'

export const createTrip = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = getIdFromPayload(req)
    const newTrip = await tripRepo.createTrip({ ...req.body, ownerId })

    return res.status(httpStatus.OK).json(getApiResponse({ data: newTrip }))
  } catch (error) {
    next(error)
  }
}

export const getTrip = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const trip = await tripRepo.findTrip({ id })

    return res.status(httpStatus.OK).json(getApiResponse({ data: trip }))
  } catch (error) {
    next(error)
  }
}

export const getProfileTrips = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req)
    const { ownerId } = req.params

    const trips = await tripRepo.getTrips({ ownerId, privacy: privacies.PUBLIC })

    const tripDTOs: any[] = []

    for (const trip of trips) {
      tripDTOs.push(getTripDTO(userId, trip))
    }

    return res.status(httpStatus.OK).json(getApiResponse({ data: tripDTOs }))
  } catch (error) {
    next(error)
  }
}

export const getHomeTrips = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = getIdFromPayload(req)

    const trips = await tripRepo.getHomeTrips({ ownerId })

    return res.status(httpStatus.OK).json(getApiResponse({ data: trips }))
  } catch (error) {
    next(error)
  }
}

const getTripDTO = (userId: string, trip: any): any => {
  const { likes, ...rest } = trip
  return {
    ...rest,
    isOwner: (trip.owner.id === userId),
    interact: {
      likes: likes.length,
      liked: likes.includes(userId)
    }
  }
}
