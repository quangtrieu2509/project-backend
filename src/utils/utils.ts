import { type RequestPayload } from '../types'

export const getIdFromPayload = (payload: RequestPayload['payload']): string => {
  if (typeof payload === 'object') return payload?.id
  else return ''
}

type TransformedObject = Record<string, number>
export const transformToPrjObj = (array: string[]): object => {
  return array.reduce((obj: TransformedObject, key) => {
    obj[key] = 1
    return obj
  }, {})
}
