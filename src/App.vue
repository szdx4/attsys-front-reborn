<template>
  <div id="app" v-loading="loading">
    <router-view></router-view>
  </div>
</template>

<script>
import { userShow } from '@/requests/user'

export default {
  name: 'app',
  data () {
    return {
      loading: false
    }
  },
  methods: {
    checkLogin () {
      this.loading = true
      let token = localStorage.getItem('token')

      if (token && token !== '') {
        this.$store.commit('setToken', token)

        let tokenPreload = decodeURIComponent(escape(window.atob(token.split('.')[1])))
        let tokenData = JSON.parse(tokenPreload)
        let expiredAt = new Date(tokenData.expired_at)

        if (expiredAt < new Date()) {
          this.$store.commit('setToken', '')
          localStorage.setItem('token', '')
          this.loading = false
        } else {
          userShow(tokenData.id).then(res => {
            let user = res.data.data
            user.departmentId = user.department.id
            this.$store.commit('setUser', user, tokenData.expired_at)
            this.loading = false
          }).catch(() => {
            this.$store.commit('setToken', '')
            localStorage.setItem('token', '')
            this.loading = false
          })
        }
      } else {
        this.loading = false
      }
    }
  },
  mounted () {
    this.checkLogin()
  }
}
</script>
