import jwt from 'jsonwebtoken'

import { accessTokenSettings } from '../configs'

export const createToken = (payload: any, expireIn: any = null): string => {
  if (expireIn != null) {
    return jwt.sign(payload, accessTokenSettings.secret, { expiresIn: expireIn })
  } else {
    return jwt.sign(payload, accessTokenSettings.secret, { expiresIn: accessTokenSettings.expireTime })
  }
}
