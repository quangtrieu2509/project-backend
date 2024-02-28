// eslint-disable-next-line import/no-cycle
import { emitter } from '../configs'
import { events } from '../constants'
import mongo from './mongo'

const connect = (): void => {
  emitter.on(events.MONGO_CONNECTED, (uri: string) => {
    console.info(`[database]-[mongo] connected ${uri}`)
    emitter.emit(events.DB_CONNECTED)
  })
  mongo.connect()
}

export default { connect }
