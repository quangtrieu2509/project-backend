import express, { type Express, type Request, type Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import timeout from 'connect-timeout'
import methodOverride from 'method-override'
import morgan from 'morgan'

import { emitter } from './event-emitter'
import { vars } from './vars'
import { events } from '../constants'
import database from '../database'
import router from '../routers'
import { notFound, errorConverter } from '../middlewares'

const app: Express = express()
const haltOnTimedout = (req: Request, _res: Response, next: any): void => {
  if (!req.timedout) {
    next()
  }
}

const initApp = (app: express.Express): void => {
  app.use(timeout('10s'))
  app.use(morgan('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(methodOverride())
  app.use(helmet())
  app.use(cors())

  app.get('/health', (_req: Request, res: Response) => {
    res.send('OK')
  })
  app.use(router)
  app.use(notFound)
  app.use(haltOnTimedout)
  app.use(errorConverter)
}

export const start = (): Express => {
  emitter.on(events.DB_CONNECTED, () => {
    initApp(app)
    app.listen(vars.port, () => {
      console.info(`[server] listen on port ${vars.port}`)
    })
  })
  database.connect()
  return app
}
