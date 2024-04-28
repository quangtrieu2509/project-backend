import { Router } from 'express'

import { tripController as controller } from '../controllers'
import { verifyToken } from '../middlewares'
import { Trip } from '../models'

const router = Router()

router
  .route('/profile-trips/:ownerId')
  .get(verifyToken, controller.getProfileTrips)

router
  .route('/home-trips')
  .get(verifyToken, controller.getHomeTrips)

router
  .route('/:id')
  .get(verifyToken, controller.getTrip)

router
  .route('/')
  .post(verifyToken, controller.createTrip)
  .delete(async (req, res, next) => {
    await Trip.deleteMany()
    res.json('ok')
  })

export default router
