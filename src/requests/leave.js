import { request } from '@/utils/request'

export function leaveList (page = 1) {
  return request('get', '/leave', {
    page: page
  })
}

export function leaveUpdate (id, status) {
  return request('put', '/leave/' + id, {
    status: status
  })
}
