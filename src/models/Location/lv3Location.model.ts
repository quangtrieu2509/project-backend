import { Schema, model } from 'mongoose'

import { type ILv3Location } from '../../types'

const locationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    lv2LocationId: {
      type: String,
      required: true,
      ref: 'lv2_Location',
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

export const Lv3Location = model<ILv3Location>('lv3_Location', locationSchema)
