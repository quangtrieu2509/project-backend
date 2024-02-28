import httpStatus from 'http-status'

import { messages } from '../constants'
class ExtendableError extends Error {
  name: string
  message: string
  ec: number
  status: number
  stack: any
  errors: any
  msg: string
  constructor ({ message, errors, stack, ec, status, msg }: any) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.ec = ec
    this.status = status
    this.stack = stack
    this.errors = errors
    this.msg = msg
  }
}

export class APIError extends ExtendableError {
  constructor ({
    message,
    errors,
    stack,
    ec = messages.INTERNAL_SERVER_ERROR.ec,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    msg = messages.INTERNAL_SERVER_ERROR.msg
  }: any) {
    console.log(status)
    super({ message, errors, stack, ec, status, msg })
  }
}

export class NotFound extends ExtendableError {
  constructor ({
    message,
    errors,
    stack,
    status = httpStatus.NOT_FOUND,
    ec = messages.NOT_FOUND.ec,
    msg = messages.NOT_FOUND.msg
  }: any) {
    super({ message, errors, stack, ec, status, msg })
  }
}
