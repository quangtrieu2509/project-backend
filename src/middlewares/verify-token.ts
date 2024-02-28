import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { type IncomingHttpHeaders } from 'http'
import httpStatus from 'http-status'
import { type Response } from 'express'
import axios from 'axios'

import { accessTokenSettings } from '../configs'
import { type RequestPayload } from '../types'
import { getApiResponse } from '../utils'
import { messages, roles } from '../constants'

const getToken = (headers: IncomingHttpHeaders): string => {
  const { authorization } = headers
  if (authorization == null) {
    throw new Error('Invalid header')
  }
  const [tokenType, token] = authorization.split(' ')
  if (tokenType !== 'Bearer' || token === undefined || token === '') {
    throw new Error('Invalid header')
  }
  return token
}

export const verifyToken = (
  req: RequestPayload,
  res: Response,
  next: any
) => {
  try {
    const token = getToken(req.headers)
    const payload = jwt.verify(token, accessTokenSettings.secret)
    req.payload = payload
    console.log('[verify-token]', payload)
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json(getApiResponse(messages.ACCESS_TOKEN_EXPIRED))
    }
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(getApiResponse(messages.ACCESS_TOKEN_INVALID))
  }
}

export const verifyAdmin = (
  req: RequestPayload,
  res: Response,
  next: any
) => {
  verifyToken(req, res, () => {
    if (typeof req.payload === 'object' && req.payload?.role === roles.ADMIN) {
      return next()
    }

    return res
      .status(httpStatus.FORBIDDEN)
      .json(getApiResponse(messages.ACCESS_TOKEN_INVALID))
  })
}

export const verifyGoogleToken = async (
  req: RequestPayload,
  res: Response,
  next: any
) => {
  try {
    const token = getToken(req.headers)
    const payload = await axios
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.data)

    req.payload = payload
    console.log('[verify-gg-token]', payload)
    next()
  } catch (error) {
    return res
      .status(httpStatus.UNAUTHORIZED)
      .json(getApiResponse(messages.ACCESS_TOKEN_INVALID))
  }
}
