import type { NextFunction, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse, getIdFromPayload } from '../utils'
import { notiRepo } from '../repositories'
import type { RequestPayload } from '../types'
import { messages } from '../constants'

export const getNotis = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const results = await notiRepo.getNotis({ userId, ...req.query })

    return res.status(httpStatus.OK).json(getApiResponse({ data: results }))
  } catch (error) {
    next(error)
  }
}

export const readNoti = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const { id } = req.params
    await notiRepo.updateNoti({ userId, id }, { isSeen: true })

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const readAllNotis = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    await notiRepo.updateAllNotis({ userId }, { isSeen: true })

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}
