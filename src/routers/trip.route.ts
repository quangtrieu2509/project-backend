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
  .route('/drawer-trips')
  .get(verifyToken, controller.getDrawerTrips)

router
  .route('/saved-item/:id')
  .put(verifyToken, controller.updateSavedItem)
  .delete(verifyToken, controller.removeSavedItem)

router
  .route('/itinerary-item/:id')
  .put(verifyToken, controller.updateItineraryItem)

router
  .route('/:id/saves')
  .get(verifyToken, controller.getSavedItems)
  .post(verifyToken, controller.addSavedItem)

router
  .route('/:id/itinerary')
  .get(verifyToken, controller.getItineraryItems)
  .post(verifyToken, controller.addItineraryItem)
  .put(verifyToken, controller.removeItineraryItems)

router
  .route('/:id')
  .get(verifyToken, controller.getTrip)
  .put(verifyToken, controller.updateTrip)
  .post(verifyToken, controller.interactTrip)
  .delete(verifyToken, controller.deleteTrip)

router
  .route('/')
  .post(verifyToken, controller.createTrip)
  .delete(async (req, res, next) => {
    await Trip.deleteMany()
    res.json('ok')
  })

export default router
