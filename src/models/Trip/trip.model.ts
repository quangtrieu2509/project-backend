import { Schema, model } from 'mongoose'

import { type ITrip } from '../../types'
import { privacies } from '../../constants'

const tripSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    ownerId: {
      type: String,
      required: true,
      ref: 'user',
      field: 'id'
    },
    locationId: {
      type: String,
      required: true,
      ref: 'location',
      field: 'id'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    privacy: {
      type: String,
      required: true,
      enum: [privacies.PUBLIC, privacies.PRIVATE]
    },
    startDate: {
      type: Date
    },
    tripLength: {
      type: Number,
      required: true,
      default: 1
    },
    image: {
      type: {
        name: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
      },
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Trip = model<ITrip>('trip', tripSchema)
