import { Schema, model } from 'mongoose'

import { type IReview } from '../../types'
import { ReviewStates } from '../../constants/review-states'

const reviewSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    userId: {
      type: String,
      required: true,
      ref: 'user',
      field: 'id'
    },
    itemId: {
      type: String,
      required: true,
      ref: 'item',
      field: 'id'
    },
    rate: {
      type: Number,
      required: true
    },
    travelDate: {
      type: Date,
      required: true
    },
    tripType: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    images: {
      type: [{
        name: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
      }],
      required: true,
      default: []
    },
    state: {
      type: String,
      required: true,
      enum: ReviewStates,
      default: ReviewStates.PENDING
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Review = model<IReview>('review', reviewSchema)
