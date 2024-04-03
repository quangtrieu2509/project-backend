import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

import { type IUser } from '../../types'
import { accountTypes, roles } from '../../constants'

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      index: { unique: true }
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
      index: { unique: true }
    },
    password: {
      type: String
    },
    phoneNumber: {
      type: String
    },
    address: {
      type: String
    },
    profileImage: {
      type: String,
      required: true,
      default: '/images/default-avatar.svg'
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
    },
    links: {
      type: {
        facebook: String,
        instagram: String,
        twitter: String,
        youtube: String,
        tiktok: String
      }
    },
    bio: {
      type: String
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
