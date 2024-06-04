import { Router } from 'express'

// import { verifyToken } from '../middlewares'
import { firebase } from '../configs'
import { getApiResponse } from '../utils'
import multer from 'multer'
import { messages } from '../constants'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage()
})

router.route('/')
  .post(upload.array('files'), async (req, res, next) => {
    const files = req.files
    console.log(files)

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).send(getApiResponse(messages.BAD_REQUEST))
    }

    const uploadPromises = files.map(async file => {
      return await new Promise((resolve, reject) => {
        const originalname = `${Date.now()}-${file.originalname}`
        const blob = firebase.bucket.file(originalname)

        const blobWriter = blob.createWriteStream({
          metadata: {
            contentType: file.mimetype
          }
        })

        blobWriter.on('error', reject)

        blobWriter.on('finish', () => {
          blob.makePublic().then(() => {
            const url = blob.publicUrl()
            resolve({
              name: originalname,
              url
            })
          }).catch(reject)
        })

        blobWriter.end(file.buffer)
      })
    })

    try {
      const responseFiles = await Promise.all(uploadPromises)

      return res.json(getApiResponse({ data: responseFiles }))
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
  .put(async (req, res, next) => {
    interface Image {
      name: string
      url: string
    }
    const files: Image[] = req.body.files ?? []
    console.log(files)

    const deletePromises = files.map(async file => {
      const blob = firebase.bucket.file(file.name)

      await blob.delete()
      console.log('Deleted file ', file.name)
    })

    try {
      await Promise.all(deletePromises)

      return res.json(getApiResponse(messages.OK))
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

export default router
