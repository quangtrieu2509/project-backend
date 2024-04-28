import { uid } from 'uid'

import { Trip } from '../models'
import type { ITrip } from '../types'
import { omitIsNil } from '../utils'

export const createTrip = async (trip: ITrip): Promise<ITrip> => {
  const newTrip = new Trip({ ...trip, id: uid() })
  return await newTrip.save()
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

export const getTrips = async (filters: any): Promise<any[]> => {
  const trips = await Trip.aggregate([
    {
      $match: omitIsNil(filters)
    },
    stdUserLookup,
    stdLikeLookup,
    {
      $addFields: {
        owner: {
          $arrayElemAt: ['$owner', 0]
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
    {
      $addFields: {
        interact: {
          likes: {
            $size: '$likes'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        description: 0
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
    {
      $addFields: {
        owner: {
          $arrayElemAt: ['$owner', 0]
        },
        interact: {
          likes: {
            $size: '$likes'
          }
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
