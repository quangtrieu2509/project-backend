import mongoose from 'mongoose'

import type { MongoSettings } from '../types'
import { vars, emitter } from '../configs'
import { events, envs } from '../constants'

mongoose.Promise = Promise

mongoose.connection.on('error', (err: Error) => {
  console.log(`[database]-[mongo] error ${err.message}`)
})

const makeMongoURI = (mongoSettings: MongoSettings): string => {
  const { servers, username, password, repls } = mongoSettings
  const hostURL = servers.split(' ').join(',')
  const loginOption =
    username != null && password != null ? `${username}:${password}@` : ''
  const replOption = repls != null ? `?replicaSet=${repls}` : ''

  const connectOption = hostURL.search('127.0.0.1') === -1 ? '+srv' : ''
  return `mongodb${connectOption}://${loginOption}${hostURL}/${replOption}`
}

const connect = (): void => {
  const uri = makeMongoURI(vars.mongo)
  if (vars.env === envs.DEV) {
    mongoose.set('debug', true)
  }
  mongoose
    .connect(uri, {
      dbName: vars.mongo.dbName
    })
    .then(() => {
      emitter.emit(events.MONGO_CONNECTED, uri)
    })
    .catch((err: Error) => {
      console.log(`[database]-[mongo] error ${err.message}`)
    })
}

export = { connect }
