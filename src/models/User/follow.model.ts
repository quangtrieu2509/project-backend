import { Schema, model } from 'mongoose'

import type { IFollow } from '../../types'

const followSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    followerId: {
      type: String,
      required: true,
      ref: 'user',
      field: 'id'
    },
    followingId: {
      type: String,
      required: true,
      ref: 'users',
      field: 'id'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

followSchema.index({ followerId: 1, followingId: 1 }, { unique: true })

export const Follow = model<IFollow>('follow', followSchema)
