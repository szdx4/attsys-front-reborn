import { request } from '@/utils/request'

export function shiftList (params) {
  return request('get', '/shift', params)
}
