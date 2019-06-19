import { request } from '@/utils/request'

export function userShow (userId) {
  return request('get', '/user/' + userId)
}

export function userAuth (name, password) {
  return request('post', '/user/auth', {
    name: name,
    password: password
  })
}

export function userList (page = 1) {
  return request('get', '/user', {
    page: page
  })
}

export function userDelete (userId) {
  return request('delete', '/user/' + userId)
}

export function userCreate (name, password, department) {
  return request('post', '/user', {
    name: name,
    password: password,
    department: parseInt(department)
  })
}

export function userEdit (userId, name, department, role, hours) {
  return request('put', '/user/' + userId, {
    name: name,
    department: parseInt(department),
    role: role,
    hours: parseInt(hours)
  })
}

export function userBatch (data) {
  return request('post', '/user/batch', {
    batch: data
  })
}

export function changePassword (id, oldPwd, newPwd) {
  return request('put', '/user/' + id + '/password', {
    old_password: oldPwd,
    new_password: newPwd
  })
}
