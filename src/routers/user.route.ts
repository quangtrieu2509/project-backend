import { Router } from 'express'

import { userController as controller } from '../controllers'
// import { userValidation as validation } from '../validations'
import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/new-feeds')
  .get(verifyToken, controller.getNewFeeds)

router
  .route('/:id/activities')
  .get(verifyToken, controller.getActivities)

router
  .route('/:id/:type(followers|followings)')
  .get(verifyToken, controller.getInteractInfo)

router
  .route('/:id')
  .get(verifyToken, controller.getProfile)
  .post(verifyToken, controller.interactUser)

// router
//   .route('/')
//   .post(validation.createUser, controller.createUser)
//   .get(verifyToken, validation.getUser, controller.getUser)

export default router
