import { Schema, model } from 'mongoose'

import { type IActivity } from '../../types'

const activitySchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    itemId: {
      type: String,
      required: true,
      ref: 'item',
      field: 'id'
    },
    categories: {
      type: [String],
      required: true
    },
    price: {
      type: [Number]
    },
    duration: {
      type: Number
    },
    ages: {
      type: [Number]
    },
    included: {
      type: [String]
    },
    excluded: {
      type: [String]
    },
    requirements: {
      type: [String]
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Activity = model<IActivity>('activity', activitySchema)
