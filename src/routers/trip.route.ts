import { Router } from 'express'

import { tripController as controller } from '../controllers'
import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/')
  // .post(verifyToken, controller.createUser)
  // .get(verifyToken, validation.getUser, controller.getUser)

router
  .route('/profile-trips/:ownerId')
  .get(verifyToken, controller.getProfileTrips)

export default router
