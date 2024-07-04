import type { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse, getIdFromPayload } from '../utils'
import { uid } from 'uid'
import { itemRepo, notiRepo } from '../repositories'
import { ItemStates, itemTypes, messages } from '../constants'
import type { RequestPayload } from '../types'

export const createItem = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = getIdFromPayload(req.payload)
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

export const getItemsOfLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const results = await itemRepo.getItemsOfLocation(id)

    return res.status(httpStatus.OK).json(getApiResponse({ data: results }))
  } catch (error) {
    next(error)
  }
}

export const getQueriedItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { type } = req.query

    let results: any[]
    switch (type) {
      case itemTypes.DINING: {
        const { types, meals, prices, rates, features } = req.body
        results = await itemRepo.getDiningQuerying(id, types, meals, prices, rates, features)
        break
      }
      case itemTypes.LODGING: {
        const { types, amenities, priceLevels, rates, roomFeatures } = req.body
        results = await itemRepo.getLodgingQuerying(id, types, amenities, priceLevels, rates, roomFeatures)
        break
      }
      case itemTypes.ATTRACTION: {
        const { types, rates } = req.body
        results = await itemRepo.getAttractionQuerying(id, types, rates)
        break
      }
      case itemTypes.ACTIVITY: {
        const { types, rates } = req.body
        results = await itemRepo.getActivityQuerying(id, types, rates)
        break
      }
      default: results = []
    }

    return res.status(httpStatus.OK).json(getApiResponse({ data: results }))
  } catch (error) {
    next(error)
  }
}

export const getBrowsingItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { locId } = req.params
    const { type } = req.query

    let results: any
    switch (type) {
      case itemTypes.DINING: {
        results = await itemRepo.getDiningBrowsing(locId)
        break
      }
      case itemTypes.LODGING: {
        results = await itemRepo.getLodgingBrowsing(locId)
        break
      }
      case itemTypes.ATTRACTION: {
        results = await itemRepo.getAttractionBrowsing(locId)
        break
      }
      case itemTypes.ACTIVITY: {
        results = await itemRepo.getActivityBrowsing(locId)
        break
      }
      default: results = {}
    }

    return res.status(httpStatus.OK).json(getApiResponse({ data: results }))
  } catch (error) {
    next(error)
  }
}

export const updateItem = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const ownerId = getIdFromPayload(req.payload)
    const { state, ...body } = req.body

    await itemRepo.updateItem({ id, ownerId }, body)

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const changeStateItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { state } = req.body

    await itemRepo.updateItem({ id }, { state, adminUpdatedAt: new Date() })

    // send noti
    void notiRepo.createItemStateNoti(id, state)

    return res.status(httpStatus.OK).json(getApiResponse(messages.OK))
  } catch (error) {
    next(error)
  }
}

export const getOwnedItems = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = getIdFromPayload(req.payload)
    let fields = req.query.fields as any

    if (fields === undefined || fields === '') fields = []
    else fields = fields.split(',')

    const items = await itemRepo.getItems({ ownerId }, fields)

    return res.status(httpStatus.OK).json(getApiResponse({ data: items }))
  } catch (error) {
    next(error)
  }
}

export const getBusinessItem = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = getIdFromPayload(req.payload)
    const { id } = req.params

    const item = await itemRepo.getItem({ id, ownerId })

    if (item === null) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
    }

    return res.status(httpStatus.OK).json(getApiResponse({ data: item }))
  } catch (error) {
    next(error)
  }
}

export const getAdminItems = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { state } = req.query

    const items = await itemRepo.getAdminItems(state as string)

    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ data: items }))
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

    const item = await itemRepo.getItemDetail({ id, state: ItemStates.ACTIVE })

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
