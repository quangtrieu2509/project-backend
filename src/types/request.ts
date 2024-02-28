import { type Request } from 'express'
import { type JwtPayload } from 'jsonwebtoken'

export interface RequestPayload extends Request {
  payload?: string | JwtPayload
}
