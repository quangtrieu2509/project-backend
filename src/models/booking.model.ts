import { Schema, model } from 'mongoose'

import type { IBooking } from '../types'
import { bookingStates } from '../constants'

const bookingSchema = new Schema(
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
    itemId: {
      type: String,
      required: true,
      ref: 'item',
      field: 'id'
    },
    note: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true,
      default: bookingStates.PENDING
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    numOfGuests: {
      type: Number
    },
    numOfRooms: {
      type: Number
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Booking = model<IBooking>('booking', bookingSchema)
