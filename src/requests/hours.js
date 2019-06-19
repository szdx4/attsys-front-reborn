import { request } from '@/utils/request'

export function hoursList (params) {
  return request('get', '/hours', params)
}
