import { Router } from 'express'

import { itemController as controller } from '../controllers'
import { verifyAdmin, verifyToken } from '../middlewares'

const router = Router()

router
  .route('/search')
  .get(controller.searchItems)

router
  .route('/admin')
  .get(verifyAdmin, controller.getAdminItems)

router
  .route('/admin/:id')
  .put(verifyAdmin, controller.changeStateItem)

router
  .route('/business/:id')
  .get(verifyToken, controller.getBusinessItem)

router
  .route('/location/:id')
  .get(controller.getItemsOfLocation)

router
  .route('/location/:id/query')
  .post(controller.getQueriedItems)

router
  .route('/browsing/:locId')
  .get(controller.getBrowsingItems)

router
  .route('/:id/detail')
  .get(controller.getItemDetail)

router
  .route('/:id')
  .get(controller.getItem)
  .put(verifyToken, controller.updateItem)

router
  .route('/')
  .post(verifyToken, controller.createItem)
  .get(verifyToken, controller.getOwnedItems)

export default router
