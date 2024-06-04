import type { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse, getIdFromPayload } from '../utils'
import { tripRepo } from '../repositories'
import { messages, privacies } from '../constants'
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

export const addSavedItem = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = getIdFromPayload(req)
    const ownerId = await tripRepo.getOwnerId({ id })

    if (ownerId === null) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
    }

    if (ownerId !== userId) {
      return res.status(httpStatus.FORBIDDEN).json(getApiResponse(messages.ACCESS_TOKEN_INVALID))
    }

    await tripRepo.addItem({ ...req.body, tripId: id })

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const removeSavedItem = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    // fix here
    // const userId = getIdFromPayload(req)
    // const ownerId = await tripRepo.getOwnerId({ id })

    // if (ownerId === null) {
    //   return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
    // }

    // if (ownerId !== userId) {
    //   return res.status(httpStatus.FORBIDDEN).json(getApiResponse(messages.ACCESS_TOKEN_INVALID))
    // }

    await tripRepo.removeItem(id)

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const addItineraryItem = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = getIdFromPayload(req)
    const ownerId = await tripRepo.getOwnerId({ id })

    if (ownerId === null) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
    }

    if (ownerId !== userId) {
      return res.status(httpStatus.FORBIDDEN).json(getApiResponse(messages.ACCESS_TOKEN_INVALID))
    }

    const newItem = await tripRepo.addItineraryItem({ ...req.body, tripId: id })

    return res.status(httpStatus.OK).json(getApiResponse({ data: newItem }))
  } catch (error) {
    next(error)
  }
}

export const updateSavedItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    await tripRepo.updateSavedItem(id, req.body)

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const updateItineraryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    await tripRepo.updateItineraryItem(id, req.body)

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
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

export const getDrawerTrips = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = getIdFromPayload(req)
    // const { itemId } = req.query

    const trips = await tripRepo.getDrawerTrips({ ownerId })

    // const tripDTOs: any[] = []

    // for (const trip of trips) {
    //   const { saves, ...rest } = trip
    //   const isSaved = saves.includes(itemId as string)
    //   tripDTOs.push({ ...rest, isSaved })
    // }

    return res.status(httpStatus.OK).json(getApiResponse({ data: trips }))
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

export const getSavedItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const items = await tripRepo.getSavedItems(id)

    return res.status(httpStatus.OK).json(getApiResponse({ data: items }))
  } catch (error) {
    next(error)
  }
}

export const getItineraryItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const items = await tripRepo.getItineraryItems(id)

    return res.status(httpStatus.OK).json(getApiResponse({ data: items }))
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
