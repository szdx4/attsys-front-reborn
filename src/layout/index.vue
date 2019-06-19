<template>
  <el-row class="app-wrapper">
    <el-col :span="24" class="header">
      <el-col :span="20" class="logo">
        员工考勤系统
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link username">{{ user.name }}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="changePasswordVisible = true"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item divided @click.native="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>

    <el-col :span="24" class="main">
      <sidebar></sidebar>

      <section class="content-container">
        <div class="grid-content">
          <el-col :span="24" class="breadcrumb-container">
            <strong class="title">{{ $route.name }}</strong>
            <el-breadcrumb separator="/" class="breadcrumb-inner">
              <el-breadcrumb-item
                v-for="item in $route.matched"
                :key="item.path"
              >
                {{ item.name }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view />
            </transition>
          </el-col>
        </div>
      </section>
    </el-col>

    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordVisible"
      width="30%"
      center
    >
      <el-form :model="passwordForm" ref="passwordForm">
        <el-form-item label="原密码" label-width="64px">
          <el-input type="password" v-model="passwordForm.oldPwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="64px">
          <el-input type="password" v-model="passwordForm.newPwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePasswordVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="changePassword"
          :loading="changePasswordLoading"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import sidebar from './sidebar'
import { isLogin } from '@/utils/user'
import { changePassword } from '@/requests/user'

export default {
  name: 'layout',
  components: {
    sidebar
  },
  methods: {
    logout () {
      localStorage.setItem('token', '')
      this.$router.push({ path: '/login' })
      this.$router.go(0)
    },
    changePassword () {
      this.changePasswordLoading = true
      changePassword(this.$store.getters.user.id, this.passwordForm.oldPwd, this.passwordForm.newPwd).then(res => {
        this.changePasswordLoading = false
        this.$notify({
          title: '提示',
          message: '修改密码成功，请重新登录',
          type: 'success'
        })
        setTimeout(() => {
          this.logout()
        }, 3000)
      }).catch(err => {
        this.changePasswordLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '修改密码失败'
        })
      })
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    }
  },
  created () {
    if (!isLogin()) {
      this.$router.push({ path: '/login' })
    }
  },
  data () {
    return {
      changePasswordLoading: false,
      changePasswordVisible: false,
      passwordForm: {
        oldPwd: '',
        newPwd: ''
      }
    }
  }
}
</script>

<style lang="scss">
.app-wrapper {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;

  .header {
    height: 60px;
    line-height: 60px;
    color: #fff;
    background-color: #3a8fb7;

    .logo {
      height: 60px;
      font-size: 22px;
      padding-left: 20px;
      padding-right: 20px;
    }

    .userinfo {
      text-align: right;
      padding-right: 35px;

      .username {
        font-size: 15px;
        color: #fff;
      }
    }
  }

  .main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
    background-color: #fcfaf2;

    .content-container {
      flex: 1;
      overflow-y: scroll;
      padding: 20px;

      .breadcrumb-container {
        .breadcrumb-inner {
          margin-top: 5px;
        }
      }

      .content-wrapper {
        margin-top: 10px;
        margin-left: 5px;
        width: 100%;
      }
    }

    .el-pagination {
      float: right;
      margin-top: 10px;
    }

    .toolbar {
      margin-top: 10px;
      margin-bottom: 10px;
      height: 60px;

      .left {
        float: left;
      }

      .right {
        float: right;
      }

      .el-button {
        margin-top: -10px;
      }

      .el-form {
        margin-top: -10px;

        .el-button {
          margin-top: 4px;
        }
      }
    }
  }
}
</style>
