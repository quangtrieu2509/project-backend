import { Schema, model } from 'mongoose'

import { type ILv4Location } from '../../types'

const locationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    lv3LocationId: {
      type: String,
      required: true,
      ref: 'lv3_Location',
      field: 'id'
    },
    name: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Lv4Location = model<ILv4Location>('lv4_Location', locationSchema)
