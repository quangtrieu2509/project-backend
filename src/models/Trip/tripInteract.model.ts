import { Schema, model } from 'mongoose'

import { type ITripInteract } from '../../types'
import { interactTypes } from '../../constants'

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
    },
    type: {
      type: String,
      required: true,
      enum: [interactTypes.LIKE, interactTypes.SAVE]
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const TripInteract = model<ITripInteract>('trip_Interact', interactSchema)
