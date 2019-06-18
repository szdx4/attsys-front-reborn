import { request } from '@/utils/request'

export function departmentList (page = 1) {
  return request('get', '/department', {
    page: page
  })
}

export function departmentDelete (id) {
  return request('delete', '/department/' + id)
}

export function departmentCreate (name) {
  return request('post', '/department', {
    name: name
  })
}

export function departmentSave (id, name) {
  return request('put', '/department/' + id, {
    name: name
  })
}
