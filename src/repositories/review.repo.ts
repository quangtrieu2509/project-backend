import { uid } from 'uid'

import { Review } from '../models'
import type { IReview } from '../types'
import { omitIsNil } from '../utils'
import { rateFilters } from '../constants/review'

export const createReview = async (review: IReview): Promise<IReview> => {
  const newReview = new Review({ ...review, id: uid() })
  return await newReview.save()
}

export const getReviews = async (filters: any, rateSelection: string): Promise<any[]> => {
  const rateFilter: Record<string, any> = {}
  switch (rateSelection) {
    case rateFilters.EXCELLENT: {
      rateFilter.rate = 5
      break
    }
    case rateFilters.GOOD: {
      rateFilter.rate = 4
      break
    }
    case rateFilters.AVERAGE: {
      rateFilter.rate = 3
      break
    }
    case rateFilters.POOR: {
      rateFilter.rate = 2
      break
    }
    case rateFilters.TERRIBLE: {
      rateFilter.rate = 1
      break
    }
    case rateFilters.IMAGE_INCLUDED: {
      rateFilter.$expr = {
        $gt: [{ $size: '$images' }, 0]
      }
      break
    }
  }
  const items = await Review.aggregate([
    {
      $match: {
        ...omitIsNil(filters),
        ...rateFilter
      }
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
              address: 1,
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
        isActive: 0,
        userId: 0
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])

  return items
}

export const getOverviewRates = async (filters: any): Promise<any> => {
  const reviews = await Review.aggregate([
    {
      $match: omitIsNil(filters)
    },
    {
      $project: {
        _id: 0,
        rate: 1,
        images: {
          $size: '$images'
        }
      }
    }
  ])

  const results: Record<string, any> = {}
  results.rateCounts = addRateCounts(reviews)
  results.rate = reviews
    .map(e => e.rate)
    .reduce((p: number, c: number) => p + c, 0) / reviews.length

  return results
}

const addRateCounts = (reviews: Array<{ rate: number, images: number }>): any => {
  const details = Array(7).fill(0)

  reviews.forEach(review => {
    details[0]++
    details[6 - review.rate]++
    if (review.images !== 0) details[6]++
  })

  return details
}
