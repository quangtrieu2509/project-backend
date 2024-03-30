import { Follow, User } from '../models'
import type { IFollow, IUser } from '../types'
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

export const checkExisted = async (filters: any): Promise<any | null> => {
  return await User.exists(omitIsNil(filters))
}

export const getProfile = async (filters: any): Promise<any | null> => {
  const user = await User.aggregate([
    {
      $match: omitIsNil(filters)
    },
    {
      $lookup: {
        from: 'follows',
        localField: 'id',
        foreignField: 'followerId',
        pipeline: [
          {
            $project: {
              _id: 0,
              followingId: 1
            }
          }
        ],
        as: 'followings'
      }
    },
    {
      $lookup: {
        from: 'follows',
        localField: 'id',
        foreignField: 'followingId',
        pipeline: [
          {
            $project: {
              _id: 0,
              followerId: 1
            }
          }
        ],
        as: 'followers'
      }
    },
    {
      $addFields: {
        followings: '$followings.followingId',
        followers: '$followers.followerId'
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ])
  return user.length === 0 ? null : user[0]
}

export const createFollow = async (follow: IFollow): Promise<IFollow> => {
  const newFollow = await Follow.create(follow)
  return await newFollow.toObject()
}

export const removeFollow = async (filters: any): Promise<IFollow | null> => {
  return await Follow.findOneAndDelete(omitIsNil(filters))
}
