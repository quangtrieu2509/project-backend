import { Schema, model } from 'mongoose'

import { type ILv2Location } from '../../types'

const locationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    lv1LocationId: {
      type: String,
      required: true,
      ref: 'lv1_Location',
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

export const Lv2Location = model<ILv2Location>('lv2_Location', locationSchema)
