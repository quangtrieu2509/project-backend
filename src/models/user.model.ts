import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

import { type IUser } from '../types'
import { accountTypes, roles } from '../constants'

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: true
    },
    familyName: {
      type: String,
      required: true
    },
    givenName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      index: true
    },
    password: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    profileImage: {
      type: String,
      required: true,
      default: 'abc'
    },
    accountType: {
      type: String,
      required: true,
      enum: [accountTypes.GOOGLE, accountTypes.EMAIL]
    },
    role: {
      type: String,
      required: true,
      default: roles.USER
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

UserSchema.pre('save', async function (next) {
  if (this.password != null) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

export const User = model<IUser>('user', UserSchema)
