import store from '@/store'

export function isLogin () {
  return store.getters.user.id !== 0
}

export function isMaster () {
  return store.getters.user.role === 'master'
}

export function isManager () {
  return store.getters.user.role === 'manager'
}
