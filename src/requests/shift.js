import { request } from '@/utils/request'

export function shiftList (params) {
  return request('get', '/shift', params)
}

export function shiftDelete (shiftId) {
  return request('delete', '/shift/' + shiftId)
}

export function shiftCreate (userId, startAt, endAt, type) {
  return request('post', '/shift/user/' + userId, {
    start_at: startAt.toJSON(),
    end_at: endAt.toJSON(),
    type: type
  })
}

export function departmentShift (departmentId, startAt, endAt, type) {
  return request('post', '/shift/department/' + departmentId, {
    start_at: startAt.toJSON(),
    end_at: endAt.toJSON(),
    type: type
  })
}

export function allShift (startAt, endAt, type) {
  return request('post', '/shift/all', {
    start_at: startAt.toJSON(),
    end_at: endAt.toJSON(),
    type: type
  })
}

export function editShift (shiftId, startAt, endAt, effect) {
  return request('put', '/shift/' + shiftId, {
    start_at: startAt.toJSON(),
    end_at: endAt.toJSON(),
    effect: effect
  })
}
