import { Router } from 'express'

import { notiController as controller } from '../controllers'
import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/:id')
  .put(verifyToken, controller.readNoti)

router
  .route('/')
  .get(verifyToken, controller.getNotis)
  .put(verifyToken, controller.readAllNotis)

export default router
