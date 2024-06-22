import { Router } from 'express'

import { bookingController as controller } from '../controllers'
import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/')
  .post(verifyToken, controller.createBooking)
  .get(verifyToken, controller.getBookings)

router
  .route('/business/:itemId')
  .get(verifyToken, controller.getBusinessBookings)

router
  .route('/business/:itemId/:id')
  .put(verifyToken, controller.updateBusinessBooking)

router
  .route('/:id')
  .put(verifyToken, controller.updateBooking)

export default router
