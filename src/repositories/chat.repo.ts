import { Convo, Message } from '../models'
import type { IConvo, IMessage } from '../types'
import { omitIsNil } from '../utils'

export const createConvo = async (convo: IConvo): Promise<IConvo> => {
  const newConvo = await Convo.create(convo)
  return await newConvo.toObject()
}

export const setSeenConvo = async (filters: any, userId: string): Promise<any> => {
  const convo = await Convo.findOne(omitIsNil(filters))
  if (convo === null || convo.latestMessage.userId === userId) return

  return await Convo.updateOne(omitIsNil(filters), { isSeen: true })
}

export const updateConvo = async (filters: any, data: any): Promise<any> => {
  return await Convo.findOneAndUpdate(omitIsNil(filters), data)
}

export const getMembers = async (filters: any): Promise<string[] | null> => {
  const convo = await Convo.findOne(omitIsNil(filters), { _id: 0, members: 1 })
  return convo === null ? convo : convo.members
}

export const createMessage = async (message: IMessage): Promise<IMessage> => {
  const newMessage = await Message.create(message)
  void updateConvo({ id: message.convoId }, { latestMessage: message, isSeen: false })
  return await newMessage.toObject()
}

export const getMessages = async (filters: any): Promise<IMessage[]> => {
  const messages = await Message.find(omitIsNil(filters), { _id: 0 })
  return messages
}

export const getUserConvos = async (userId: string, unreadFilter: boolean = false): Promise<any[]> => {
  const extraMatch = unreadFilter
    ? { 'latestMessage.userId': { $ne: userId }, isSeen: false }
    : {}
  const convos = await Convo.aggregate([
    {
      $match: {
        members: userId,
        ...extraMatch
      }
    },
    {
      $sort: {
        updatedAt: -1
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'members',
        foreignField: 'id',
        pipeline: [
          {
            $match: {
              id: { $ne: userId }
            }
          },
          {
            $project: {
              _id: 0,
              id: 1,
              profileImage: 1,
              givenName: 1,
              familyName: 1
            }
          }
        ],
        as: 'receiver'
      }
    },
    {
      $addFields: {
        receiver: { $arrayElemAt: ['$receiver', 0] }
      }
    },
    {
      $project: {
        _id: 0,
        'members._id': 0
      }
    }
  ])

  return convos
}
