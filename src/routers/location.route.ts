import { Router } from 'express'

import { locationController as controller } from '../controllers'
import { verifyToken } from '../middlewares'

const router = Router()

router
  .route('/search')
  .get(verifyToken, controller.searchLocations)

router
  .route('/:slug/breadcrumb')
  .get(verifyToken, controller.getBreadcrumb)

router
  .route('/:slug')
  .get(controller.getLocation)

router
  .route('/')
  .post(controller.createLocation)

export default router
