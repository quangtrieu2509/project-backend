import { Router } from 'express'

import { chatController as controller } from '../controllers'
import { verifyToken } from '../middlewares'
import { Message } from '../models'

const router = Router()

router
  .route('/:convoId')
  .get(verifyToken, controller.getMessages)

router
  .route('/')
  .get(verifyToken, controller.getUserConvos)
  .post(verifyToken, controller.createMessage)
  .delete(async (req, res) => {
    await Message.deleteMany()
    return res.json('OK')
  })

export default router
