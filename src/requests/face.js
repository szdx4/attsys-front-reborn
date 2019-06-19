import { request } from '@/utils/request'

export function faceList (params) {
  return request('get', '/face', params)
}

export function faceUpdate (id) {
  return request('put', '/face/' + id)
}
