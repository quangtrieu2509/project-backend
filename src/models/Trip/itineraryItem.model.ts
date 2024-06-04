import { Schema, model } from 'mongoose'

import type { IItineraryItem } from '../../types'

const itemSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    savedItemId: {
      type: String,
      required: true,
      ref: 'saved_item',
      field: 'id'
    },
    tripId: {
      type: String,
      required: true,
      ref: 'trip',
      field: 'id'
    },
    day: {
      type: Number,
      required: true,
      default: 1
    },
    orderNumber: {
      type: Number,
      required: true,
      default: 0
    },
    hasBooked: {
      type: Boolean
    },
    startTime: {
      type: String
    },
    note: {
      type: String
    },
    numOfGuests: {
      type: Number
    },
    reservationNumber: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

itemSchema.pre('save', async function (next) {
  const latestItem = await ItineraryItem.find().sort({ orderNumber: -1 }).limit(1)
  this.orderNumber = latestItem[0]?.orderNumber ?? 0 + 1
  next()
})

export const ItineraryItem = model<IItineraryItem>('itinerary_item', itemSchema)
