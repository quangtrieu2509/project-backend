import { Router } from 'express'

import userRouters from './user.route'
import authRouters from './auth.route'
import tripRouters from './trip.route'
import locationRouters from './location.route'
import itemRouters from './item.route'
import reviewRouters from './review.route'

const router = Router()

router.use('/auth', authRouters)
router.use('/user', userRouters)
router.use('/trip', tripRouters)
router.use('/location', locationRouters)
router.use('/item', itemRouters)
router.use('/review', reviewRouters)

export default router
