import { Location } from '../models'
import type { ILocation } from '../types'
import { omitIsNil } from '../utils'

export const createLocation = async (loc: ILocation): Promise<ILocation> => {
  const newLoc = await Location.create(loc)
  return await newLoc.toObject()
}

export const getLocation = async (filters: any): Promise<ILocation | null> => {
  const loc = await Location.findOne(omitIsNil(filters), { _id: 0 })
  return loc === null ? loc : await loc.toObject()
}

export const updateLocation = async (filters: any, data: any): Promise<ILocation | null> => {
  const loc = await Location.findOneAndUpdate(omitIsNil(filters), data)
  return loc === null ? loc : await Location.findOne({ id: loc.id }, { _id: 0 })
}

export const getLocations = async (parentId?: string): Promise<any> => {
  if (parentId !== undefined) {
    const loc = await getBreadcrumb({ id: parentId })

    if (loc === null) return { ancestors: [], locations: [] }

    const ancestors = loc.breadcrumb
    const { level, id } = ancestors[ancestors.length - 1]
    const locs = await Location.find({ ancestors: { $elemMatch: { id } }, level: (+level) + 1 }, { _id: 0 })
    return { ancestors, locations: locs }
  } else {
    const locs = await Location.find({ level: 1 }, { _id: 0 })
    return { ancestors: [], locations: locs }
  }
}

export const getOverviewLocations = async (parentId: string): Promise<any> => {
  const parent = await Location.findOne({ id: parentId })

  if (parent === null) return []

  const { level, id } = parent
  const results = await Location.find(
    { ancestors: { $elemMatch: { id } }, level: (+level) + 1 },
    { _id: 0, id: 1, name: 1, slug: 1, image: { $arrayElemAt: ['$images', 0] } }
  )
  return results
}

export const searchListLocations = async (query: string): Promise<any[]> => {
  if (query === '') {
    return []
  }

  const results = await Location.find({
    name: { $regex: query, $options: 'i' }
  }, { _id: 0 })
  return results
}

export const getBreadcrumb = async (filters: any): Promise<any | null> => {
  const loc = await Location.findOne(omitIsNil(filters), { _id: 0, images: 0, description: 0 })

  if (loc === null) return loc

  const { ancestors, id, name, level, slug, coordinates } = loc
  ancestors.reverse().push({
    id, name, level, slug
  })

  return { breadcrumb: ancestors, coordinates }
}

export const searchLocations = async (query: string, limit: number = 6): Promise<any[]> => {
  if (query === '') {
    return []
  }

  const locations = await Location.aggregate([
    {
      $match: {
        name: { $regex: query, $options: 'i' }
      }
    },
    {
      $sort: {
        name: 1
      }
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        slug: 1,
        level: 1,
        ancestors: 1,
        image: { $arrayElemAt: ['$images', 0] }
      }
    },
    {
      $limit: limit
    }
  ])

  return locations
}
