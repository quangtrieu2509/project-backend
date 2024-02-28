import { User } from '../models'
import { type IUser } from '../types'
import { omitIsNil } from '../utils'

export const createUser = async (user: IUser): Promise<IUser> => {
  const newUser = await User.create(user)
  return await newUser.toObject()
}

export const getUser = async (filters: any): Promise<IUser | null> => {
  const user = await User.findOne(omitIsNil(filters), { _id: 0 })
  return user === null ? user : await user.toObject()
}

export const updateUser = async (filters: any, fields: any): Promise<IUser | null> => {
  return await User.findOneAndUpdate(omitIsNil(filters), omitIsNil(fields))
}

export const removeUser = async (filters: any): Promise<IUser | null> => {
  return await User.findOneAndDelete(omitIsNil(filters))
}
