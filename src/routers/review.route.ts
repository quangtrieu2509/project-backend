import { Router } from 'express'

import { reviewController as controller } from '../controllers'
import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/rate/:itemId')
  .get(controller.getOverviewRates)

router
  .route('/profile-reviews/:userId')
  .get(verifyToken, controller.getProfileReviews)

router
  .route('/item/:itemId')
  .get(controller.getReviews)

router
  .route('/:id')
  .get(verifyToken, controller.getReview)
  .post(verifyToken, controller.interactReview)

router
  .route('/')
  .post(verifyToken, controller.createReview)

export default router
