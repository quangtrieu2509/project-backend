import { itemTypes } from '../constants'
import { Item, Location } from '../models'
import { omitIsNil, transformToPrjObj } from '../utils'

export const createItem = async (item: any): Promise<any> => {
  const newItem = await Item.create(item)
  return newItem.toObject()
}

export const getItem = async (filters: any, project: string[] = []): Promise<any | null> => {
  const projectObj = transformToPrjObj(project)
  const item = await Item.findOne(omitIsNil(filters), { _id: 0, ...projectObj })
  return item === null ? item : item.toObject()
}

export const updateItem = async (id: string, data: any): Promise<any | null> => {
  const item = await Item.findOneAndUpdate({ id }, data)
  return item === null ? item : item.toObject()
}

export const getItems = async (filters: any, project: string[] = []): Promise<any[]> => {
  const projectObj = transformToPrjObj(project)
  const items = await Item.find(omitIsNil(filters), { _id: 0, ...projectObj })
  return items
}

export const getItemDetail = async (filters: any): Promise<any | null> => {
  const items = await Item.aggregate([
    {
      $match: omitIsNil(filters)
    },
    ...lookupReview,
    {
      $project: {
        _id: 0
      }
    }
  ])

  if (items.length === 0) return null

  items[0].reviewCounts = addReviewDetails(items[0].reviewCounts)
  return items[0]
}

export const searchItems = async (query: string, filter: any = 'all', limit: number = 10): Promise<any[]> => {
  if (query === '') {
    return []
  }

  let itemPromise, locationPromise
  const stdMatch = {
    $match: {
      name: { $regex: query, $options: 'i' }
    }
  }
  const stdLimit = {
    $limit: limit
  }
  const stdProject = {
    _id: 0,
    id: 1,
    name: 1,
    ancestors: 1,
    image: { $arrayElemAt: ['$images', 0] }
  }

  const generateLocAggregate = (): any[] => [
    stdMatch, stdLimit,
    {
      $project: {
        ...stdProject,
        slug: 1,
        type: 'location'
      }
    }
  ]
  const generateItemAggregate = (type: string): any[] => [
    {
      $match: {
        type, name: { $regex: query, $options: 'i' }
      }
    },
    stdLimit,
    ...lookupReview,
    {
      $project: {
        ...stdProject,
        review: 1,
        categories: 1,
        type: 1
      }
    }
  ]

  if (filter === 'all') {
    locationPromise = Location.aggregate(generateLocAggregate())
    itemPromise = Item.aggregate([
      stdMatch, stdLimit,
      ...lookupReview,
      {
        $project: {
          ...stdProject,
          review: 1,
          categories: 1,
          type: 1
        }
      }
    ])
  } else if (filter === itemTypes.LOCATION) {
    locationPromise = Location.aggregate(generateLocAggregate())
  } else {
    itemPromise = Item.aggregate(generateItemAggregate(filter))
  }

  const items = await Promise.all([itemPromise, locationPromise])
  return items
    .filter(Boolean)
    .flat()
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit)
}

const lookupReview = [
  {
    $lookup: {
      from: 'reviews',
      localField: 'id',
      foreignField: 'itemId',
      pipeline: [
        {
          $project:
          {
            _id: 0,
            rate: 1
          }
        }
      ],
      as: 'reviewCounts'
    }
  },
  {
    $addFields: {
      review: {
        rate: {
          $avg: '$reviewCounts.rate'
        },
        total: {
          $size: '$reviewCounts'
        }
      }
    }
  }
]

type ReviewObj = Record<number, number>
const addReviewDetails = (reviews: Array<{ rate: number }>): any => {
  const details: ReviewObj = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  reviews.forEach(review => {
    if (review.rate in details) {
      details[review.rate]++
    }
  })

  return details
}
