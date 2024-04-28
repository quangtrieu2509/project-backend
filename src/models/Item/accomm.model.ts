import { Schema, model } from 'mongoose'

import { type IAccomm } from '../../types'

const accommSchema = new Schema(
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
    amenities: {
      type: [String]
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Accomm = model<IAccomm>('accomm', accommSchema)
