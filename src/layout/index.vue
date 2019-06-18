<template>
  <el-row class="app-wrapper">
    <el-col :span="24" class="header">
      <el-col :span="20" class="logo">
        test
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link username">test</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>我的信息</el-dropdown-item>
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
  </el-row>
</template>

<script>
import sidebar from './sidebar'
import { isLogin } from '@/utils/user'

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
    }
  },
  created () {
    if (!isLogin()) {
      this.$router.push({ path: '/login' })
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
      width: 100%;
      padding: 20px;

      .breadcrumb-container {
        .breadcrumb-inner {
          margin-top: 5px;
        }
      }

      .content-wrapper {
        margin-top: 5px;
        margin-left: 5px;
        width: 100%;
      }
    }
  }
}
</style>
