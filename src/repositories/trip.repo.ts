import { v4 } from 'uuid'

import { Trip } from '../models'
import type { ITrip } from '../types'
import { omitIsNil } from '../utils'
import { interactTypes } from '../constants'

export const createTrip = async (trip: ITrip): Promise<ITrip> => {
  const newTrip = new Trip({ ...trip, id: v4() })
  return await newTrip.save()
}

export const getTrips = async (filters: any): Promise<any[]> => {
  const trips = await Trip.aggregate([
    {
      $match: omitIsNil(filters)
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
      $lookup: {
        from: 'trip_interacts',
        localField: 'id',
        foreignField: 'tripId',
        pipeline: [
          {
            $match:
            {
              $expr:
              { $eq: ['$type', interactTypes.LIKE] }
            }
          },
          {
            $project: {
              _id: 0,
              userId: 1
            }
          }
        ],
        as: 'likes'
      }
    },
    {
      $lookup: {
        from: 'trip_interacts',
        localField: 'id',
        foreignField: 'tripId',
        pipeline: [
          {
            $match:
            {
              $expr:
              { $eq: ['$type', interactTypes.SAVE] }
            }
          },
          {
            $project: {
              _id: 0,
              userId: 1
            }
          }
        ],
        as: 'saves'
      }
    },
    {
      $addFields: {
        owner: {
          $arrayElemAt: ['$owner', 0]
        },
        likes: '$likes.userId',
        saves: '$saves.userId'
      }
    },
    {
      $project: {
        _id: 0,
        ownerId: 0
      }
    }
  ])

  return trips
}

export const findTrip = async (filters: any): Promise<ITrip | null> => {
  const trip = await Trip.findOne(omitIsNil(filters), { _id: 0 })
  return trip === null ? null : await trip.toObject()
}
