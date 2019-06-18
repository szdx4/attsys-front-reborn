<template>
  <div class="login-container">
    <el-form
      class="login-form"
      autocomplete="on"
      label-position="left"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
    >
      <div class="title-container">
        <h3 class="title">Login</h3>
      </div>

      <el-form-item prop="username">
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        ></el-input>
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <el-input
            ref="password"
            v-model="loginForm.password"
            placeholder="Password"
            name="password"
            :type="passwordType"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          ></el-input>
          <span class="show-password" @click="showPassword">
            <i :class="hidePasswordIcon"></i>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;"
        @click.native.prevent="handleLogin"
        >Login</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { isLogin } from '@/utils/user'
import { userAuth, userShow } from '@/requests/user'

export default {
  name: 'login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('用户名必须大于 3 位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('密码必须大于 4 位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false
    }
  },
  computed: {
    hidePasswordIcon () {
      if (this.passwordType === 'password') {
        return 'el-icon-view'
      } else {
        return 'el-icon-remove-outline'
      }
    }
  },
  created () {
    if (isLogin()) {
      this.$router.push({ path: '/' })
    }

    document.title = '登录'
  },
  destroyed () {
    //
  },
  mounted () {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock ({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (!shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPassword () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true

          let username = this.loginForm.username
          let password = this.loginForm.password

          userAuth(username, password).then(res => {
            let response = res.data
            let token = response.token
            localStorage.setItem('token', token)
            this.$store.commit('setToken', token)

            let tokenPreload = decodeURIComponent(escape(window.atob(token.split('.')[1])))
            let tokenData = JSON.parse(tokenPreload)

            userShow(tokenData.id).then(res => {
              this.loading = false

              let user = res.data.data
              user.departmentId = user.department.id
              this.$store.commit('setUser', user, tokenData.expired_at)

              this.$notify({
                title: '提示',
                message: '登录成功',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push({ path: '/home' })
              }, 1000)
            }).catch(() => {
              this.loading = false
              location.href = '/#/home'
            })
          }).catch(() => {
            this.loading = false

            this.$notify.error({
              title: '提示',
              message: '用户名或密码错误'
            })
          })
        } else {
          this.$notify.warn({
            title: '提示',
            message: '用户名或密码格式不正确'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-password {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

  .el-input {
    display: inline-block;
    height: 47px;

    input {
      background: transparent;
      padding: 12px 5px 12px 15px;
      height: 47px;
    }
  }
}
</style>
