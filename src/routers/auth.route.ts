import { Router } from 'express'

import { authController } from '../controllers'
import { verifyGoogleToken } from '../middlewares'

const router = Router()

router.route('/google')
  .get(verifyGoogleToken, authController.signInByGoogle)

router.route('/email/signin')
  .post(authController.signInByEmail)

router.route('/email/signup')
  .post(authController.signUpByEmail)

router.route('/activate-email/:activeToken')
  .get(authController.activateEmail)

export default router
