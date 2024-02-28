import { type RequestPayload } from '../types'

export const getIdFromPayload = (req: RequestPayload): string => {
  if (typeof req.payload === 'object') return req.payload?.id
  else return ''
}
