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
    destination: {
      id: {
        type: String,
        required: true
        // config more if needed
      },
      name: {
        type: String,
        required: true
      },
      details: {
        type: [String]
      },
      image: {
        type: String,
        required: true
      },
      level: {
        type: Number,
        required: true
      },
      slug: {
        type: String,
        required: true
      }
    },
    startDate: {
      type: Date
    },
    tripLength: {
      type: Number,
      required: true,
      default: 1
    },
    saves: {
      type: [Object]
    },
    itinerary: {
      type: [Object]
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Trip = model<ITrip>('trip', tripSchema)
