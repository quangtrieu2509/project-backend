import { Router } from 'express'

import { reviewController as controller } from '../controllers'
import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/')
  .post(verifyToken, controller.createReview)
  // .delete(async (req, res, next) => {
  //   await Review.deleteMany()
  //   res.json('ok')
  // })

export default router
