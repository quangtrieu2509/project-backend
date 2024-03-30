import { Schema, model } from 'mongoose'

import { type ILv1Location } from '../../types'

const locationSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
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

export const Lv1Location = model<ILv1Location>('Lv1_Location', locationSchema)
