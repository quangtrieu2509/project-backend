import type { APIResponse } from '../types'
import { omitIsNil } from './omit'

export const getApiResponse = (response: any = {}): APIResponse => {
  const apiResponse: APIResponse = {
    ec: response.ec ?? 0,
    msg: response.msg,
    data: response.data,
    total: response.total
  }
  return omitIsNil(apiResponse)
}
