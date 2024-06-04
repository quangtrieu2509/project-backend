import mongoose, { Schema, model } from 'mongoose'

import { type ILocation } from '../types'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

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
    description: {
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
    slug: {
      type: String,
      slug: ['name', 'id']
    },
    level: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Location = model<ILocation>('location', locationSchema)
