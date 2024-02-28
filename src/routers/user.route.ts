import { Router } from 'express'

import { userController } from '../controllers'
import { userValidation as validation } from '../validations'
import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/')
  .post(validation.createUser, userController.createUser)
  .get(verifyToken, validation.getUser, userController.getUser)

export default router
