import { Schema, model } from 'mongoose'

import type { ISavedItem } from '../../types'

const itemSchema = new Schema(
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
    tripId: {
      type: String,
      required: true,
      ref: 'trip',
      field: 'id'
    },
    note: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

itemSchema.index({ itemId: 1, tripId: 1 }, { unique: true })

export const SavedItem = model<ISavedItem>('saved_item', itemSchema)
