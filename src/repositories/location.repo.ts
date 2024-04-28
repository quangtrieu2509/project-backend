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

export const getBreadcrumb = async (filters: any): Promise<any | null> => {
  const loc = await Location.findOne(omitIsNil(filters), { _id: 0 })

  if (loc === null) return loc

  const { ancestors, id, name, level, slug } = loc
  ancestors.unshift({
    id, name, level, slug
  })

  return ancestors
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
        details: {
          $map: {
            input: '$ancestors',
            as: 'anc',
            in: '$$anc.name'
          }
        },
        image: { $arrayElemAt: ['$images', 0] }
      }
    },
    {
      $limit: limit
    }
  ])

  return locations
}
