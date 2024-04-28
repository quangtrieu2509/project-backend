import { Schema, model } from 'mongoose'

import { type IReview } from '../../types'

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
      type: [String],
      required: true,
      default: []
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Review = model<IReview>('review', reviewSchema)
