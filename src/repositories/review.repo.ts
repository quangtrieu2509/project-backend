import { uid } from 'uid'

import { Review, ReviewInteract } from '../models'
import type { IReview, IReviewInteract } from '../types'
import { omitIsNil } from '../utils'
import { rateFilters } from '../constants/review'
import { ReviewStates } from '../constants/review-states'

export const createReview = async (review: IReview): Promise<IReview> => {
  const newReview = new Review({ ...review, id: uid() })
  return await newReview.save()
}

export const updateReview = async (filters: any, data: any): Promise<any | null> => {
  const item = await Review.findOneAndUpdate(omitIsNil(filters), data)
  return item === null ? item : item.toObject()
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
        user: { $arrayElemAt: ['$user', 0] }
      }
    },
    {
      $lookup: {
        from: 'review_interacts',
        localField: 'id',
        foreignField: 'reviewId',
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
    },
    {
      $addFields: {
        likes: '$likes.userId'
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

export const getProfileReviews = async (filters: any): Promise<any[]> => {
  const reviews = await Review.aggregate([
    {
      $match: {
        ...omitIsNil(filters)
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
        user: { $arrayElemAt: ['$user', 0] }
      }
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
              ancestors: 1,
              images: 1,
              type: 1
            }
          }
        ],
        as: 'item'
      }
    },
    {
      $addFields: { item: { $arrayElemAt: ['$item', 0] } }
    },
    {
      $lookup: {
        from: 'reviews',
        localField: 'item.id',
        foreignField: 'itemId',
        pipeline: [
          {
            $match:
            {
              $expr:
              { $eq: ['$state', ReviewStates.ACTIVE] }
            }
          },
          {
            $project: {
              _id: 0,
              rate: 1
            }
          }
        ],
        as: 'reviewCounts'
      }
    },
    {
      $lookup: {
        from: 'review_interacts',
        localField: 'id',
        foreignField: 'reviewId',
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
    },
    {
      $addFields: {
        'item.review': {
          rate: { $avg: '$reviewCounts.rate' },
          total: { $size: '$reviewCounts' }
        },
        'item.image': { $arrayElemAt: ['$item.images', 0] },
        likes: '$likes.userId'
      }
    },
    {
      $project: {
        _id: 0,
        itemId: 0,
        userId: 0,
        reviewCounts: 0,
        'item.images': 0
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ])

  return reviews
}

export const getAdminReviews = async (state: string): Promise<any[]> => {
  const reviews = await Review.aggregate([
    {
      $match: { state }
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
        user: { $arrayElemAt: ['$user', 0] }
      }
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
              ancestors: 1,
              images: 1,
              type: 1
            }
          }
        ],
        as: 'item'
      }
    },
    {
      $addFields: { item: { $arrayElemAt: ['$item', 0] } }
    },
    {
      $lookup: {
        from: 'reviews',
        localField: 'item.id',
        foreignField: 'itemId',
        pipeline: [
          {
            $match:
            {
              $expr:
              { $eq: ['$state', ReviewStates.ACTIVE] }
            }
          },
          {
            $project: {
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
        userId: 0,
        reviewCounts: 0,
        'item.images': 0
      }
    },
    {
      $sort: state === ReviewStates.PENDING ? { createdAt: 1 } : { updatedAt: -1 }
    }
  ])

  return reviews
}

export const createInteract = async (interact: IReviewInteract): Promise<IReviewInteract> => {
  const newInteract = await ReviewInteract.create(interact)
  return await newInteract.toObject()
}

export const removeInteract = async (filters: any): Promise<IReviewInteract | null> => {
  return await ReviewInteract.findOneAndDelete(omitIsNil(filters))
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
