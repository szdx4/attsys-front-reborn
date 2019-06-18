import store from '@/store'
import axios from 'axios'

const getHeaders = () => {
  let token = store.getters.user.token

  if (token !== '') {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  } else {
    return {
      'Content-Type': 'application/json'
    }
  }
}

const request = (method, url, data = {}) => {
  return axios({
    method: method,
    baseURL: store.getters.apiBase,
    url: url,
    headers: getHeaders(),
    params: (method === 'get') ? data : {},
    data: (method !== 'get') ? data : {},
    timeout: 5000
  })
}

export function userShow (userId) {
  return request('get', 'user/' + userId)
}

export function userAuth (name, password) {
  return request('post', 'user/auth', {
    name: name,
    password: password
  })
}
