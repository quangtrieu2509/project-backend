import { Schema, model } from 'mongoose'

import { type IMessage } from '../../types'

const messageSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
    },
    convoId: {
      type: String,
      required: true,
      ref: 'convo',
      field: 'id'
    },
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
  {
    versionKey: false,
    timestamps: true
  }
)

export const Message = model<IMessage>('message', messageSchema)
