import { Schema, model } from 'mongoose'

import { type ITripInteract } from '../../types'

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
    tripId: {
      type: String,
      required: true,
      ref: 'trip',
      field: 'id'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const TripInteract = model<ITripInteract>('trip_interact', interactSchema)
