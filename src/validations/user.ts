import { Joi, type schema } from 'express-validation'

import validate from './validate'

const createUser: schema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required()
  })
}

const getUser: schema = {
  query: Joi.object({
    email: Joi.string()
  })
}

export const userValidation = {
  createUser: validate(createUser),
  getUser: validate(getUser)
}
