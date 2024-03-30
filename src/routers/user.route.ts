import { Router } from 'express'

import { userController as controller } from '../controllers'
import { userValidation as validation } from '../validations'
import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/')
  .post(validation.createUser, controller.createUser)
  // .get(verifyToken, validation.getUser, controller.getUser)

router
  .route('/:id')
  .get(verifyToken, controller.getProfile)
  .post(verifyToken, controller.interactUser)

export default router
