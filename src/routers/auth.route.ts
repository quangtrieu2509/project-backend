import { Router } from 'express'

import { authController as controller } from '../controllers'
import { verifyGoogleToken } from '../middlewares'

const router = Router()

router.route('/google')
  .get(verifyGoogleToken, controller.signInByGoogle)

router.route('/email/signin')
  .post(controller.signInByEmail)

router.route('/email/signup')
  .post(controller.signUpByEmail)

router.route('/activate-email/:activeToken')
  .get(controller.activateEmail)

export default router
