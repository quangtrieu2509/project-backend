import { uid } from 'uid'

import { ItineraryItem, SavedItem, Trip, TripInteract } from '../models'
import type { IItineraryItem, ISavedItem, ITrip, ITripInteract } from '../types'
import { omitIsNil } from '../utils'

export const createTrip = async (trip: ITrip): Promise<ITrip> => {
  const newTrip = new Trip({ ...trip, id: uid() })
  return await newTrip.save()
}

export const addItem = async (item: ISavedItem): Promise<ISavedItem> => {
  const newItem = new SavedItem({ ...item, id: uid() })
  return await newItem.save()
}

export const addItineraryItem = async (item: IItineraryItem): Promise<IItineraryItem> => {
  const newItem = new ItineraryItem({ ...item, id: uid() })
  return await newItem.save()
}

export const removeItem = async (id: string): Promise<any | null> => {
  const savedItemPromise = SavedItem.findOneAndDelete({ id })
  const itineraryItemPromise = ItineraryItem.deleteMany({ savedItemId: id })
  return await Promise.all([savedItemPromise, itineraryItemPromise])
}

export const updateSavedItem = async (id: string, data: any): Promise<any> => {
  return await SavedItem.findOneAndUpdate({ id }, data)
}

export const updateItineraryItem = async (id: string, data: any): Promise<any> => {
  return await ItineraryItem.findOneAndUpdate({ id }, data)
}

export const getSavedItems = async (tripId: string): Promise<any[]> => {
  const items = await SavedItem.aggregate([
    {
      $match: { tripId }
    },
    {
      $lookup: {
        from: 'items',
        localField: 'itemId',
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1,
              categories: 1,
              ancestors: 1,
              coordinates: 1,
              address: 1,
              images: 1,
              description: 1,
              type: 1,
              isReservable: 1
            }
          }
        ],
        as: 'item'
      }
    },
    {
      $addFields: {
        item: { $arrayElemAt: ['$item', 0] }
      }
    },
    stdReviewLookup,
    {
      $addFields: {
        'item.review': {
          rate: { $avg: '$reviewCounts.rate' },
          total: { $size: '$reviewCounts' }
        },
        'item.image': { $arrayElemAt: ['$item.images', 0] }
      }
    },
    {
      $project: {
        _id: 0,
        itemId: 0,
        reviewCounts: 0,
        'item.images': 0
      }
    }
  ])
  return items
}

export const getItineraryItems = async (tripId: string): Promise<any[]> => {
  const items = await ItineraryItem.aggregate([
    {
      $match: { tripId }
    },
    {
      $lookup: {
        from: 'saved_items',
        localField: 'savedItemId',
        foreignField: 'id',
        as: 'savedItem'
      }
    },
    {
      $addFields: {
        item: { $arrayElemAt: ['$savedItem', 0] }
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: 'savedItem.itemId',
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              name: 1,
              categories: 1,
              coordinates: 1,
              address: 1,
              ancestors: 1,
              images: 1,
              description: 1,
              type: 1
            }
          }
        ],
        as: 'item'
      }
    },
    {
      $addFields: {
        item: { $arrayElemAt: ['$item', 0] }
      }
    },
    stdReviewLookup,
    {
      $addFields: {
        'item.review': {
          rate: { $avg: '$reviewCounts.rate' },
          total: { $size: '$reviewCounts' }
        },
        'item.image': { $arrayElemAt: ['$item.images', 0] }
      }
    },
    {
      $project: {
        _id: 0,
        itemId: 0,
        reviewCounts: 0,
        'item.images': 0,
        savedItem: 0
      }
    }
  ])
  return items
}

export const getOwnerId = async (filters: any): Promise<string | null> => {
  const trip = await Trip.findOne(omitIsNil(filters), { _id: 0, ownerId: 1 })
  return trip === null ? trip : trip.ownerId
}

const stdUserLookup = {
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
}

const stdLikeLookup = {
  $lookup: {
    from: 'trip_interacts',
    localField: 'id',
    foreignField: 'tripId',
    pipeline: [
      {
        $project: {
          _id: 0,
          userId: 1
        }
      }
    ],
    as: 'likes'
  }
}

const stdLocationLookup = {
  $lookup: {
    from: 'locations',
    localField: 'locationId',
    foreignField: 'id',
    pipeline: [
      {
        $project: {
          _id: 0,
          description: 0,
          images: 0,
          'ancestors._id': 0
        }
      }
    ],
    as: 'destination'
  }
}

const stdReviewLookup = {
  $lookup: {
    from: 'reviews',
    localField: 'item.id',
    foreignField: 'itemId',
    pipeline: [
      {
        $project: {
          _id: 0,
          rate: 1
        }
      }
    ],
    as: 'reviewCounts'
  }
}

export const getTrips = async (filters: any): Promise<any[]> => {
  const trips = await Trip.aggregate([
    {
      $match: omitIsNil(filters)
    },
    stdUserLookup,
    stdLikeLookup,
    stdLocationLookup,
    {
      $addFields: {
        owner: {
          $arrayElemAt: ['$owner', 0]
        },
        destination: {
          $arrayElemAt: ['$destination', 0]
        },
        likes: '$likes.userId'
      }
    },
    {
      $project: {
        _id: 0,
        ownerId: 0,
        description: 0
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])

  return trips
}

export const getDrawerTrips = async (filters: any): Promise<any[]> => {
  const trips = await Trip.aggregate([
    {
      $match: omitIsNil(filters)
    },
    stdLocationLookup,
    {
      $lookup: {
        from: 'saved_items',
        localField: 'id',
        foreignField: 'tripId',
        pipeline: [
          {
            $project:
            {
              _id: 0,
              id: 1,
              itemId: 1
            }
          }
        ],
        as: 'saves'
      }
    },
    {
      $addFields: {
        destination: {
          $arrayElemAt: ['$destination', 0]
        }
      }
    },
    {
      $project: {
        _id: 0,
        ownerId: 0,
        description: 0
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])

  return trips
}

export const getHomeTrips = async (filters: any): Promise<any[]> => {
  const trips = await Trip.aggregate([
    {
      $match: omitIsNil(filters)
    },
    stdLikeLookup,
    stdLocationLookup,
    {
      $addFields: {
        interact: {
          likes: {
            $size: '$likes'
          }
        },
        destination: {
          $arrayElemAt: ['$destination', 0]
        }
      }
    },
    {
      $project: {
        _id: 0,
        description: 0
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])

  return trips
}

export const findTrip = async (filters: any): Promise<any | null> => {
  const trip = await Trip.aggregate([
    {
      $match: omitIsNil(filters)
    },
    stdUserLookup,
    stdLikeLookup,
    stdLocationLookup,
    {
      $addFields: {
        owner: {
          $arrayElemAt: ['$owner', 0]
        },
        interact: {
          likes: {
            $size: '$likes'
          }
        },
        destination: {
          $arrayElemAt: ['$destination', 0]
        }
      }
    },
    {
      $project: {
        _id: 0,
        ownerId: 0
      }
    }
  ])
  return trip.length === 0 ? null : trip[0]
}

export const createInteract = async (interact: ITripInteract): Promise<ITripInteract> => {
  const newInteract = await TripInteract.create(interact)
  return await newInteract.toObject()
}

export const removeInteract = async (filters: any): Promise<ITripInteract | null> => {
  return await TripInteract.findOneAndDelete(omitIsNil(filters))
}
