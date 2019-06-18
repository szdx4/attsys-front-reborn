<template>
  <div class="content">
    <div v-if="role === 'manager' || role === 'master'">
      <panel-group :data="panelGroupData"></panel-group>
    </div>

    <div v-if="role === 'user'">
      <sign-status></sign-status>
    </div>
  </div>
</template>

<script>
import PanelGroup from '@/components/status/PanelGroup'
import SignStatus from '@/components/status/SignStatus'
import { statusUser, statusSign } from '@/requests/status'

export default {
  name: 'home',
  components: {
    PanelGroup,
    SignStatus
  },
  mounted () {
    document.title = '主页'
  },
  created () {
    if (this.role === 'manager' || this.role === 'master') {
      this.loadDataAdmin()
    } else if (this.role === 'user') {
      this.loadDataUser()
    }
  },
  data () {
    return {
      panelGroupData: [
        {
          title: '用户数',
          icon: 'el-icon-user',
          count: 0
        },
        {
          title: '已签到',
          icon: 'el-icon-check',
          count: 0
        },
        {
          title: '迟到',
          icon: 'el-icon-close',
          count: 0
        },
        {
          title: '请假',
          icon: 'el-icon-info',
          count: 0
        }
      ]
    }
  },
  computed: {
    role () {
      return this.$store.getters.user.role
    }
  },
  methods: {
    loadDataAdmin () {
      statusUser().then(res => {
        let data = res.data
        this.panelGroupData[0].count = data.users
      }).catch(() => {
        this.$notify.error({
          title: '提示',
          message: '获取用户统计数据失败'
        })
      })

      statusSign().then(res => {
        let data = res.data
        this.panelGroupData[1].count = data.signed
        this.panelGroupData[2].count = data.lated
        this.panelGroupData[3].count = data.leaved
      }).catch(() => {
        this.$notify.error({
          title: '提示',
          message: '获取签到统计数据失败'
        })
      })
    },
    loadDataUser () {}
  }
}
</script>

<style lang="scss">
</style>
