import { Router } from 'express'

import { itemController as controller } from '../controllers'
// import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/')
  .post(controller.createItem)

export default router
