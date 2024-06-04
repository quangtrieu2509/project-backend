import { Router } from 'express'

import { locationController as controller } from '../controllers'
import { verifyToken } from '../middlewares'
// import { Location } from '../models'

const router = Router()

router
  .route('/search')
  .get(verifyToken, controller.searchLocations)

// router.route('/update/:id')
//   .put(async (req, res, next) => {
//     const loc = await Location.aggregate([
//       {
//         $match: { id: req.params.id }
//       }
//     ])
//     const { images } = loc[0]
//     const newImages = images.map((e: string) => ({
//       name: '#',
//       url: e
//     }))
//     await Location.findOneAndUpdate({ id: req.params.id }, { images: newImages })
//     return res.json(newImages)
//   })

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
