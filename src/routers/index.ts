import { Router } from 'express'

import userRouters from './user.route'
import authRouters from './auth.route'

const router = Router()

router.use('/auth', authRouters)
router.use('/users', userRouters)

export default router
