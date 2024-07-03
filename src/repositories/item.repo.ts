import { itemStates, itemTypes } from '../constants'
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

export const getItemsOfLocation = async (locId: string): Promise<any> => {
  const results = await Item.aggregate([
    {
      $match: { 'ancestors.id': locId, state: itemStates.ACTIVE }
    },
    ...lookupReview,
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        ancestors: 1,
        categories: 1,
        type: 1,
        price: 1,
        ticketPrice: 1,
        review: 1,
        reviewCounts: 1,
        image: { $arrayElemAt: ['$images', 0] }
      }
    },
    {
      $sort: {
        'review.total': -1 // sort by total reviews
      }
    }
  ])

  results.map(e => {
    e.reviewCounts = e.reviewCounts.filter((rv: any) => rv.rate === 5).length
    return e
  }).sort((a, b) => Number(a.reviewCounts > b.reviewCounts)) // sort by total 5-rates

  type Result = Record<string, any[]>
  const resultDtos: Result = {
    attraction: [],
    lodging: [],
    dining: [],
    activity: []
  }

  results.forEach(e => {
    resultDtos[e.type].length < 8 && resultDtos[e.type].push(e) // limit records
  })

  return resultDtos
}

export const updateItem = async (filters: any, data: any): Promise<any | null> => {
  const item = await Item.findOneAndUpdate(omitIsNil(filters), data)
  return item === null ? item : item.toObject()
}

export const getItems = async (filters: any, project: string[] = []): Promise<any[]> => {
  const projectObj = transformToPrjObj(project)
  const items = await Item.find(omitIsNil(filters), { _id: 0, ...projectObj })
  return items
}

export const getAdminItems = async (state: string): Promise<any[]> => {
  const items = await Item.aggregate([
    {
      $match: { state }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'ownerId',
        foreignField: 'id',
        pipeline: [
          {
            $project:
            {
              _id: 0,
              id: 1,
              familyName: 1,
              givenName: 1,
              profileImage: 1
            }
          }
        ],
        as: 'owner'
      }
    },
    {
      $addFields: {
        owner: { $arrayElemAt: ['$owner', 0] }
      }
    },
    {
      $project: {
        _id: 0,
        ownerId: 0
      }
    },
    {
      $sort: state === itemStates.PENDING ? { createdAt: 1 } : { adminUpdatedAt: -1 }
    }
  ])
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
    {
      $match: {
        name: { $regex: query, $options: 'i' }
      }
    }, stdLimit,
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
        type,
        state: itemStates.ACTIVE,
        name: { $regex: query, $options: 'i' }
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
      {
        $match: {
          name: { $regex: query, $options: 'i' },
          state: itemStates.ACTIVE
        }
      }, stdLimit,
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

const getItemsByPopularity = async (locId: string, type: string): Promise<any[]> => {
  const results = await Item.aggregate([
    {
      $match: { 'ancestors.id': locId, type, state: itemStates.ACTIVE }
    },
    ...lookupReview,
    {
      $addFields: {
        image: { $arrayElemAt: ['$images', 0] }
      }
    },
    {
      $project: {
        _id: 0,
        ownerId: 0,
        address: 0,
        description: 0,
        contacts: 0,
        isReservable: 0,
        hours: 0,
        images: 0,
        duration: 0,
        ages: 0,
        included: 0,
        excluded: 0,
        requirements: 0
      }
    },
    {
      $sort: {
        'review.total': -1 // sort by total reviews
      }
    }
  ])

  return results.map(e => {
    e.reviewCounts = e.reviewCounts.filter((rv: any) => rv.rate === 5).length
    return e
  }).sort((a, b) => Number(a.reviewCounts > b.reviewCounts)) // sort by total 5-rates
}

const containsAny = (arr1: any[], arr2: any[]): boolean => {
  if (arr2.length === 0) return true
  return arr2.some(item => arr1.includes(item))
}
const compareRate = (rate: number, rateList: any[]): boolean => {
  if (rateList.length === 0) return true
  return rateList.some(item => Number(item) <= (Math.round(rate * 2) / 2))
}

export const getDiningBrowsing = async (locId: string): Promise<any> => {
  const results = await getItemsByPopularity(locId, itemTypes.DINING)

  type Result = Record<string, any[]>
  const resultDtos: Result = {
    restaurants: [],
    'coffee-tea': [],
    dinner: [],
    $: []
  }
  const limit = 6
  results.forEach(e => {
    if (
      Boolean(e.categories.includes('restaurants')) &&
      resultDtos.restaurants.length < limit
    ) {
      resultDtos.restaurants.push(e)
    } else if (
      Boolean(e.categories.includes('coffee-tea')) &&
      resultDtos['coffee-tea'].length < limit
    ) {
      resultDtos['coffee-tea'].push(e)
    } else if (
      Boolean(e.features.includes('dinner')) &&
      resultDtos.dinners.length < limit
    ) {
      resultDtos.dinner.push(e)
    } else if (
      e.price.level === '$' &&
      resultDtos.$.length < limit
    ) {
      resultDtos.$.push(e)
    }
  })

  return resultDtos
}

export const getDiningQuerying = async (
  locId: string,
  types: string[],
  meals: string[],
  prices: string[],
  rates: string[],
  features: string[]
): Promise<any[]> => {
  const results = await getItemsByPopularity(locId, itemTypes.DINING)

  return results.filter(e => (
    containsAny(e.categories, types) &&
    containsAny(e.features, meals) &&
    containsAny([e.price.level], prices) &&
    containsAny(e.features, features) &&
    compareRate(e.review.rate, rates)
  ))
}

export const getLodgingBrowsing = async (locId: string): Promise<any> => {
  const results = await getItemsByPopularity(locId, itemTypes.LODGING)

  type Result = Record<string, any[]>
  const resultDtos: Result = {
    hotel: [],
    campground: [],
    resort: [],
    '24h-checkin': []
  }
  const limit = 6
  results.forEach(e => {
    if (
      Boolean(e.categories.includes('hotel')) &&
      resultDtos.hotel.length < limit
    ) {
      resultDtos.hotel.push(e)
    } else if (
      Boolean(e.categories.includes('campground')) &&
      resultDtos.campground.length < limit
    ) {
      resultDtos.campground.push(e)
    } else if (
      Boolean(e.categories.includes('resort')) &&
      resultDtos.resort.length < limit
    ) {
      resultDtos.resort.push(e)
    } else if (
      Boolean(e.features.includes('24h-checkin')) &&
      resultDtos['24h-checkin'].length < limit
    ) {
      resultDtos['24h-checkin'].push(e)
    }
  })

  return resultDtos
}

export const getLodgingQuerying = async (
  locId: string,
  types: string[],
  amenities: string[],
  priceLevels: string[],
  rates: string[],
  roomFeatures: string[]
): Promise<any[]> => {
  const results = await getItemsByPopularity(locId, itemTypes.LODGING)

  return results.filter(e => (
    containsAny(e.categories, types) &&
    containsAny(e.amenities, amenities) &&
    containsAny([e.price.level], priceLevels) &&
    containsAny(e.amenities, roomFeatures) &&
    compareRate(e.review.rate, rates)
  ))
}

export const getAttractionBrowsing = async (locId: string): Promise<any> => {
  const results = await getItemsByPopularity(locId, itemTypes.ATTRACTION)

  type Result = Record<string, any[]>
  const resultDtos: Result = {
    'nat-park': [],
    beach: [],
    island: [],
    'ancient-ruin': []
  }
  const limit = 6
  results.forEach(e => {
    if (
      Boolean(e.categories.includes('nat-park')) &&
      resultDtos['nat-park'].length < limit
    ) {
      resultDtos['nat-park'].push(e)
    } else if (
      Boolean(e.categories.includes('beach')) &&
      resultDtos.beach.length < limit
    ) {
      resultDtos.beach.push(e)
    } else if (
      Boolean(e.categories.includes('island')) &&
      resultDtos.island.length < limit
    ) {
      resultDtos.island.push(e)
    } else if (
      Boolean(e.categories.includes('ancient-ruin')) &&
      resultDtos['ancient-ruin'].length < limit
    ) {
      resultDtos['ancient-ruin'].push(e)
    }
  })

  return resultDtos
}

export const getAttractionQuerying = async (
  locId: string,
  types: string[],
  rates: string[]
): Promise<any[]> => {
  const results = await getItemsByPopularity(locId, itemTypes.ATTRACTION)

  return results.filter(e => (
    containsAny(e.categories, types) &&
    compareRate(e.review.rate, rates)
  ))
}

export const getActivityBrowsing = async (locId: string): Promise<any> => {
  const results = await getItemsByPopularity(locId, itemTypes.ACTIVITY)

  type Result = Record<string, any[]>
  const resultDtos: Result = {
    tour: [],
    'day-trip': [],
    'motor-tour': [],
    'scube-snorkel': []
  }
  const limit = 6
  results.forEach(e => {
    if (
      Boolean(e.categories.includes('tour')) &&
      resultDtos.tour.length < limit
    ) {
      resultDtos.tour.push(e)
    } else if (
      Boolean(e.categories.includes('day-trip')) &&
      resultDtos['day-trip'].length < limit
    ) {
      resultDtos['day-trip'].push(e)
    } else if (
      Boolean(e.categories.includes('motor-tour')) &&
      resultDtos['motor-tour'].length < limit
    ) {
      resultDtos['motor-tour'].push(e)
    } else if (
      Boolean(e.categories.includes('scube-snorkel')) &&
      resultDtos['scube-snorkel'].length < limit
    ) {
      resultDtos['scube-snorkel'].push(e)
    }
  })

  return resultDtos
}

export const getActivityQuerying = async (
  locId: string,
  types: string[],
  rates: string[]
): Promise<any[]> => {
  const results = await getItemsByPopularity(locId, itemTypes.ACTIVITY)

  return results.filter(e => (
    containsAny(e.categories, types) &&
    compareRate(e.review.rate, rates)
  ))
}
