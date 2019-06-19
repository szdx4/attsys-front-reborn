import { request } from '@/utils/request'

export function overtimeList (page = 1) {
  return request('get', '/overtime', {
    page: page
  })
}

export function overtimeUpdate (overtimeId, status) {
  return request('put', '/overtime/' + overtimeId, {
    status: status
  })
}
