import {
  validate as baseValidate,
  type EvOptions,
  type schema
} from 'express-validation'
import { type ValidationOptions } from 'joi'
import { type RequestHandler } from 'express'

const evOptions: EvOptions = {
  context: true,
  keyByField: true
}

const validate = (
  schema: schema
): RequestHandler => {
  return baseValidate(schema, evOptions)
}

export default validate
