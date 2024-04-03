import type { NextFunction, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse, getIdFromPayload } from '../utils'
import { tripRepo } from '../repositories'
import { privacies } from '../constants'
import type { RequestPayload } from '../types'

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

const getTripDTO = (userId: string, trip: any): any => {
  const { likes, saves, ...rest } = trip
  return {
    ...rest,
    isOwner: (trip.owner.id === userId),
    interact: {
      likes: likes.length,
      saves: saves.length,
      liked: likes.includes(userId),
      saved: saves.includes(userId)
    }
  }
}
