import type { NextFunction, Response } from 'express'
import httpStatus from 'http-status'
import { getApiResponse, getIdFromPayload } from '../utils'
import { chatRepo } from '../repositories'
import type { RequestPayload } from '../types'
import { messages } from '../constants'
import { uid } from 'uid'
import { sendMessage } from '../routers/socket.route'

export const getUserConvos = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const unread = req.query.unread

    const convos = await chatRepo.getUserConvos(userId, Boolean(unread))

    return res.status(httpStatus.OK).json(getApiResponse({ data: convos }))
  } catch (error) {
    next(error)
  }
}

export const checkConvo = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = getIdFromPayload(req.payload)
    const { userId } = req.params

    const convo = await chatRepo.getConvoByMembers(id, userId)

    if (convo === null) {
      return res.status(httpStatus.NOT_FOUND).json(getApiResponse(messages.NOT_FOUND))
    }

    return res.status(httpStatus.OK).json(getApiResponse({ data: convo }))
  } catch (error) {
    next(error)
  }
}

// export const sendNewMessage = async (
//   req: RequestPayload,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const id = getIdFromPayload(req.payload)
//     const { userId } = req.params

//     const convo = await chatRepo.sendNewMessage(id, userId, req.body.content)

//     return res.status(httpStatus.OK).json(getApiResponse({ data: convo }))
//   } catch (error) {
//     next(error)
//   }
// }

export const getMessages = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const { convoId } = req.params

    const messages = await chatRepo.getMessages({ convoId })
    void chatRepo.setSeenConvo({ id: convoId }, userId)

    return res.status(httpStatus.OK).json(getApiResponse({ data: messages }))
  } catch (error) {
    next(error)
  }
}

export const createMessage = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getIdFromPayload(req.payload)
    const { convoId, desUserId } = req.body

    if (convoId !== undefined) {
      const newMessage = await chatRepo.createMessage({ ...req.body, id: uid(), userId })
      void sendMessage(newMessage)
      return res.status(httpStatus.OK).json(getApiResponse({ data: newMessage }))
    } else if (desUserId !== undefined) {
      const convo = {
        id: uid(),
        members: [
          userId, desUserId
        ],
        latestMessage: {
          userId, content: req.body.content
        },
        isSeen: false
      }
      const newConvo = await chatRepo.createConvo(convo)
      const message = {
        id: uid(),
        convoId: newConvo.id,
        ...newConvo.latestMessage
      }
      const newMessage = await chatRepo.createMessage(message)
      void sendMessage(newMessage)
      return res.status(httpStatus.OK).json(getApiResponse({ data: newMessage }))
    } else return res.status(httpStatus.BAD_REQUEST).json(getApiResponse(messages.BAD_REQUEST))
  } catch (error) {
    next(error)
  }
}
