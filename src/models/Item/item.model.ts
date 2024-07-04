import { Schema, model } from 'mongoose'

import { type IItem } from '../../types'
import { ItemStates, timeUnits } from '../../constants'

const itemSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    ownerId: {
      type: String,
      required: true,
      ref: 'user',
      field: 'id'
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
    description: {
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
    },
    images: {
      type: [{
        name: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
      }],
      required: true,
      default: []
    },
    isReservable: {
      type: Boolean,
      required: true,
      default: false
    },
    state: {
      type: String,
      required: true,
      enum: ItemStates,
      default: ItemStates.PENDING
    },
    adminUpdatedAt: {
      type: Date
    },
    categories: {
      type: [String],
      required: true
    },
    price: {
      type: {
        level: {
          type: String,
          required: true
        },
        range: {
          type: [Number]
        }
      }
    },
    hours: {
      type: [{
        type: {
          open: {
            type: String,
            required: true
          },
          close: {
            type: String,
            required: true
          }
        },
        default: null
      }]
    },
    features: {
      type: [String]
    },
    amenities: {
      type: [String]
    },
    ticketPrice: {
      type: [Number]
    },
    duration: {
      type: {
        value: {
          type: Number,
          required: true
        },
        unit: {
          type: String,
          required: true,
          enum: timeUnits
        }
      }
    },
    ages: {
      type: [Number]
    },
    included: {
      type: String
    },
    excluded: {
      type: String
    },
    requirements: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Item = model<IItem>('item', itemSchema)
