import { privacies } from '../constants'
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
        from: 'trips',
        localField: 'id',
        foreignField: 'ownerId',
        pipeline: [
          {
            $match:
            {
              $expr:
              { $eq: ['$privacy', privacies.PUBLIC] }
            }
          }
        ],
        as: 'contributions'
      }
    },
    {
      $addFields: {
        contributions: {
          $size: '$contributions'
        }
      }
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

export const getInteractInfo = async (ownerId: string, userId: string, type: string): Promise<any[]> => {
  let match: object = { anything: 0 }
  let localField: string = ''
  if (type === 'followings') {
    match = { followerId: ownerId }
    localField = 'followingId'
  } else if (type === 'followers') {
    match = { followingId: ownerId }
    localField = 'followerId'
  }

  const userList = await Follow.aggregate([
    {
      $match: match
    },
    {
      $lookup: {
        from: 'users',
        localField,
        foreignField: 'id',
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 1,
              familyName: 1,
              givenName: 1,
              address: 1,
              profileImage: 1
            }
          }
        ],
        as: 'user'
      }
    },
    {
      $addFields: {
        user: {
          $arrayElemAt: ['$user', 0]
        }
      }
    },
    {
      $lookup: {
        from: 'trips',
        localField,
        foreignField: 'ownerId',
        pipeline: [
          {
            $match:
            {
              $expr:
              { $eq: ['$privacy', privacies.PUBLIC] }
            }
          }
        ],
        as: 'contributions'
      }
    },
    {
      $addFields: {
        contributions: {
          $size: '$contributions'
        }
      }
    },
    {
      $lookup: {
        from: 'follows',
        localField,
        foreignField: 'followingId',
        pipeline: [
          {
            $match:
            {
              $expr:
              {
                $eq: ['$followerId', userId]
              }
            }
          }
        ],
        as: 'isFollowing'
      }
    },
    {
      $addFields: {
        isFollowing: {
          $toBool: {
            $size: '$isFollowing'
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        followerId: 0,
        followingId: 0
      }
    }
  ])
  return userList
}
