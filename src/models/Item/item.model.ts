import { Schema, model } from 'mongoose'

import { type IItem } from '../../types'

const itemSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    ancestors: {
      type: [{
        id: {
          type: String,
          required: true,
          ref: 'location',
          field: 'id'
        },
        name: {
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
      }],
      required: true,
      default: []
    },
    name: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number]
    },
    address: {
      type: [String]
    },
    contacts: {
      phoneNumber: {
        type: String,
        required: true
      },
      website: {
        type: String
      },
      email: {
        type: String
      }
    },
    type: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Item = model<IItem>('item', itemSchema)
