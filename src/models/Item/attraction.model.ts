import { Schema, model } from 'mongoose'

import { type IAttraction } from '../../types'

const attractionSchema = new Schema(
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
    hours: {
      type: [{
        type: {
          open: {
            type: String,
            required: true
          },
          close: {
            type: String,
            required: true
          }
        },
        default: null
      }],
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Attraction = model<IAttraction>('attraction', attractionSchema)
