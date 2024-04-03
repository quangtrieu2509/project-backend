import { Router } from 'express'

import userRouters from './user.route'
import authRouters from './auth.route'
import tripRouters from './trip.route'

const router = Router()

router.use('/auth', authRouters)
router.use('/user', userRouters)
router.use('/trip', tripRouters)

export default router
