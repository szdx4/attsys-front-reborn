import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {
    id: 0,
    role: '',
    department: 0,
    token: '',
    expired_at: ''
  },
  api: {
    base: 'https://attsys.koder.me/'
  }
}

const getters = {
  user: state => {
    return state.user
  },
  apiBase: state => {
    return state.api.base
  }
}

const mutations = {
  setToken: (state, token) => {
    state.user.token = token
  },
  setUser: (state, user, expiredAt) => {
    state.user.id = user.id
    state.user.name = user.name
    state.user.role = user.role
    state.user.department = user.departmentId
    state.expired_at = expiredAt
  }
}

export default new Vuex.Store({
  state: state,
  getters: getters,
  mutations: mutations
})
