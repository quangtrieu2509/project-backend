import type { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse, getIdFromPayload } from '../utils'
import { uid } from 'uid'
import { itemRepo } from '../repositories'
import { messages } from '../constants'
import type { RequestPayload } from '../types'

export const createItem = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = getIdFromPayload(req)
    const newItem = await itemRepo.createItem({ id: uid(), ...req.body, ownerId })
    return res.status(httpStatus.OK).json(getApiResponse({ data: newItem }))
  } catch (error) {
    next(error)
  }
}

export const getItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    let fields = req.query.fields as any

    if (fields === undefined || fields === '') fields = []
    else fields = fields.split(',')

    const item = await itemRepo.getItem({ id }, fields)

    if (item === null) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
    }

    return res.status(httpStatus.OK).json(getApiResponse({ data: item }))
  } catch (error) {
    next(error)
  }
}

export const updateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    await itemRepo.updateItem(id, req.body)

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const getItems = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = getIdFromPayload(req)
    let fields = req.query.fields as any

    if (fields === undefined || fields === '') fields = []
    else fields = fields.split(',')

    const items = await itemRepo.getItems({ ownerId }, fields)

    return res.status(httpStatus.OK).json(getApiResponse({ data: items }))
  } catch (error) {
    next(error)
  }
}

export const getItemDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const item = await itemRepo.getItemDetail({ id })

    if (item === null) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
    }

    return res.status(httpStatus.OK).json(getApiResponse({ data: item }))
  } catch (error) {
    next(error)
  }
}

export const searchItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q, filter } = req.query
    const items = await itemRepo.searchItems(q as string, filter)
    return res
      .status(httpStatus.OK)
      .json(getApiResponse(
        {
          total: items.length,
          data: items
        })
      )
  } catch (error) {
    next(error)
  }
}
