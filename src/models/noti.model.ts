import { Schema, model } from 'mongoose'

import type { INoti } from '../types'
import { notiTypes } from '../constants'

const notiSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    userId: {
      type: String,
      required: true,
      ref: 'user',
      field: 'id'
    },
    type: {
      type: String,
      required: true,
      enum: notiTypes
    },
    content: {
      type: String,
      required: true
    },
    url: {
      type: String
    },
    isSeen: {
      type: Boolean,
      required: true,
      default: false
    },
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
  {
    versionKey: false,
    timestamps: false
  }
)

export const Noti = model<INoti>('noti', notiSchema)
