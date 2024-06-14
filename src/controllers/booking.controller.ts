import type { NextFunction, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse, getIdFromPayload } from '../utils'
import { bookingRepo } from '../repositories'
import type { RequestPayload } from '../types'
import { uid } from 'uid'
import { messages } from '../constants'

export const createBooking = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const newBooking = await bookingRepo.createBooking({ ...req.body, userId, id: uid() })

    return res.status(httpStatus.OK).json(getApiResponse({ data: newBooking }))
  } catch (error) {
    next(error)
  }
}

export const updateBooking = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const booking = await bookingRepo.updateBooking({ userId, id: req.params.id }, req.body)

    if (booking === null) return res.status(httpStatus.BAD_REQUEST).json(getApiResponse(messages.BAD_REQUEST))

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const updateBusinessBooking = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemId, id } = req.params
    const booking = await bookingRepo.updateBooking({ itemId, id }, req.body)

    if (booking === null) return res.status(httpStatus.BAD_REQUEST).json(getApiResponse(messages.BAD_REQUEST))

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const getBookings = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const state = req.query.state as string

    const bookings = await bookingRepo.getBookings({ userId, state })

    return res.status(httpStatus.OK).json(getApiResponse({ data: bookings }))
  } catch (error) {
    next(error)
  }
}

export const getBusinessBookings = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const itemId = req.params.id
    const state = req.query.state as string

    const bookings = await bookingRepo.getBusinessBookings({ itemId, state })

    return res.status(httpStatus.OK).json(getApiResponse({ data: bookings }))
  } catch (error) {
    next(error)
  }
}
