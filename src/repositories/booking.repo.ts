import { bookingStates } from '../constants'
import { Booking } from '../models'
import type { IBooking } from '../types'
import { omitIsNil } from '../utils'

export const createBooking = async (booking: IBooking): Promise<IBooking> => {
  const newBooking = await Booking.create(booking)
  return await newBooking.toObject()
}

export const updateBooking = async (filters: any, data: any): Promise<IBooking | null> => {
  const booking = await Booking.findOneAndUpdate(omitIsNil(filters), data)
  return booking
}

export const getBusinessBookings = async (filters: any): Promise<any[]> => {
  let stdSort: any = {
    $sort: {
      updatedAt: 1
    }
  }
  if (filters.state === bookingStates.COMPLETED || filters.state === bookingStates.CANCELLED) {
    stdSort = {
      $sort: {
        updatedAt: -1
      }
    }
  }
  const bookings = await Booking.aggregate([
    {
      $match: omitIsNil(filters)
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
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
        as: 'user'
      }
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ['$user', 0]
        }
      }
    },
    {
      $project: {
        _id: 0,
        userId: 0
      }
    },
    stdSort
  ])

  return bookings
}

export const getBookings = async (filters: any): Promise<any[]> => {
  const bookings = await Booking.aggregate([
    {
      $match: omitIsNil(filters)
    },
    {
      $lookup: {
        from: 'items',
        localField: 'itemId',
        foreignField: 'id',
        pipeline: [
          {
            $project:
            {
              _id: 0,
              id: 1,
              name: 1,
              ancestors: 1,
              address: 1,
              type: 1,
              image: {
                $arrayElemAt: ['$images', 0]
              },
              categories: 1
            }
          }
        ],
        as: 'item'
      }
    },
    {
      $addFields: {
        item: {
          $arrayElemAt: ['$item', 0]
        }
      }
    },
    {
      $project: {
        _id: 0,
        itemId: 0
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])

  return bookings
}
