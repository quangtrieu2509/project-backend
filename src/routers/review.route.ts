import { Router } from 'express'

import { reviewController as controller } from '../controllers'
import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/rate/:itemId')
  .get(controller.getOverviewRates)

router
  .route('/:itemId')
  .get(controller.getReviews)

router
  .route('/')
  .post(verifyToken, controller.createReview)

export default router
