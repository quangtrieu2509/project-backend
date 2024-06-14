import express, { type Express, type Request, type Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import timeout from 'connect-timeout'
import methodOverride from 'method-override'
import morgan from 'morgan'
import { Server } from 'socket.io'

import { emitter } from './event-emitter'
import { vars } from './vars'
import { events } from '../constants'
import database from '../database'
import router from '../routers'
import { notFound, errorConverter } from '../middlewares'
import { createServer } from 'http'
import { socketRoutes } from '../routers/socket.route'

const app: Express = express()
const httpServer = createServer(app)
const haltOnTimedout = (req: Request, _res: Response, next: any): void => {
  if (!req.timedout) {
    next()
  }
}

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  }
})

const initApp = (app: express.Express, socket: Server): void => {
  socketRoutes(socket)

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
    initApp(app, io)
    httpServer.listen(vars.port, () => {
      console.info(`[server] listen on port ${vars.port}`)
    })
  })
  database.connect()
  return app
}
