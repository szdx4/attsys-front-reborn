import { request } from '@/utils/request'

export function userShow (userId) {
  return request('get', 'user/' + userId)
}

export function userAuth (name, password) {
  return request('post', 'user/auth', {
    name: name,
    password: password
  })
}
