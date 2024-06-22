import jwt from 'jsonwebtoken'
import { accessTokenSettings } from '../configs'
import type { Server } from 'socket.io'
import { chatRepo, userRepo } from '../repositories'
import type { IMessage, INoti, RequestPayload } from '../types'
import { getIdFromPayload } from '../utils'

// contain userId and array of socketId
let socketio: Server

export const socketRoutes = (io: Server): void => {
  socketio = io
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.headers.authorization ?? null

      if (token !== null) {
        const accessToken = token.split(' ')[1]
        jwt.verify(accessToken, accessTokenSettings.secret, async (_err: any, payload: RequestPayload['payload']) => {
          const user = await userRepo.getUser({ id: getIdFromPayload(payload) })
          if (user !== null) {
            socket.join('user_' + user.id)
            socket.userId = user.id
          } else {
            throw new Error('User not found')
          }

          console.log('Verified!')
          next()
        })
      } else {
        throw new Error('Missing Token')
      }
    } catch (error) {
      next(new Error('unAuthorization'))
    }
  })

  io.on('connection', (socket: any) => {
    console.log('[socket] New connection: ', socket.id)
    console.log(socket.adapter.rooms)

    socket.on('disconnect', async (_res: any) => {
      console.log('[socket] Disconnect: ', socket.id)

      // socket.to('user_' + (socket.userId as string)).emit('detail', 'imma leaving')
      socket.leave('user_' + (socket.userId as string))

      console.log(socket.adapter.rooms)
    })
  })
}

export const sendNoti = (noti: INoti): void => {
  socketio.to('user_' + noti.userId).emit('noti', noti)
}

export const sendMessage = async (message: IMessage): Promise<void> => {
  const members = await chatRepo.getMembers({ id: message.convoId })
  if (members !== null) {
    members.forEach(e => {
      socketio.to('user_' + e).emit('message', message)
    })
  }
}
