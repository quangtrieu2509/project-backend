import { Schema, model } from 'mongoose'

import { type IConvo } from '../../types'

const convoSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    members: {
      type: [
        {
          type: String,
          required: true,
          ref: 'user',
          field: 'id'
        }
      ],
      required: true
    },
    latestMessage: {
      type: {
        userId: {
          type: String,
          required: true,
          ref: 'user',
          field: 'id'
        },
        content: {
          type: String,
          required: true
        }
      },
      required: true
    },
    isSeen: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const Convo = model<IConvo>('convo', convoSchema)
