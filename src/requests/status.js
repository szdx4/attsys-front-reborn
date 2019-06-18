import { request } from '@/utils/request'

export function statusUser () {
  return request('get', '/status/user')
}

export function statusSign () {
  return request('get', '/status/sign')
}
