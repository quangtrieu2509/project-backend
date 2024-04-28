import { Schema, model } from 'mongoose'

import { type IReviewInteract } from '../../types'

const interactSchema = new Schema(
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
    reviewId: {
      type: String,
      required: true,
      ref: 'review',
      field: 'id'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const ReviewInteract = model<IReviewInteract>('review_interact', interactSchema)
