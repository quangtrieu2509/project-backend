import { Schema, model } from 'mongoose'

import { type IDining } from '../../types'

const diningSchema = new Schema(
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
      type: {
        level: {
          type: String,
          required: true
        },
        range: {
          type: [Number]
        }
      },
      required: true
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
    },
    features: {
      type: [String]
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Dining = model<IDining>('dining', diningSchema)
