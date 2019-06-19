import { request } from '@/utils/request'

export function messageList (toUserId, page = 1) {
  return request('get', '/message', {
    page: page,
    to_user_id: toUserId
  })
}

export function messageShow (id) {
  return request('get', '/message/' + id)
}
