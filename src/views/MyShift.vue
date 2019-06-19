<template>
  <section>
    <el-calendar v-model="showDate">
      <template slot="dateCell" slot-scope="{ date, data }">
        <div class="dayCell" @click="handleClick(data.day)">
          <div class="day">
            {{
              data.day
                .split("-")
                .slice(1)
                .join("/")
            }}
          </div>
        </div>
      </template>
    </el-calendar>

    <el-dialog
      title="排班信息"
      :visible.sync="detailVisible"
      width="30%"
      center
    >
      <el-card class="box-card" v-for="item in shiftData" :key="item.id">
        <p>
          开始时间：<b>{{ new Date(item.start_at).toLocaleString() }}</b>
        </p>
        <p>
          结束时间：<b>{{ new Date(item.end_at).toLocaleString() }}</b>
        </p>
        <p>
          类型：<b>{{ typeFormatter(item.type) }}</b>
        </p>
        <p>
          状态：<b>{{ statusFormatter(item.status) }}</b>
        </p>
      </el-card>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisible = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { shiftList } from '@/requests/shift'

export default {
  name: 'myshift',
  data () {
    return {
      detailVisible: false,
      showDate: new Date(),
      shiftData: []
    }
  },
  methods: {
    typeFormatter (type) {
      if (type === 'allovertime') {
        return '全员加班'
      } else {
        return '正常排班'
      }
    },
    statusFormatter (status) {
      if (status === 'no') {
        return '未签到'
      } else if (status === 'on') {
        return '已签到'
      } else if (status === 'off') {
        return '已签退'
      } else if (status === 'leave') {
        return '请假'
      } else {
        return '未知'
      }
    },
    handleClick (day) {
      this.requestShift(day)
    },
    requestShift (day) {
      let startAt = new Date(day)
      let endAt = new Date()
      endAt.setTime(startAt.getTime() + 3600 * 1000 * 24)
      let params = {
        user_id: this.$store.getters.user.id,
        department_id: this.$store.getters.user.department,
        start_at: startAt.toJSON(),
        end_at: endAt.toJSON(),
        page: 1
      }

      shiftList(params).then(res => {
        if (res.status === 204) {
          this.$notify.info({
            title: '提示',
            message: '当天没有排班信息'
          })
        } else if (res.status === 200) {
          this.shiftData = res.data.data
          this.detailVisible = true
          this.$notify({
            title: '提示',
            message: '获取排班信息成功',
            type: 'success'
          })
        }
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '获取排班信息失败'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.el-calendar {
  .dayCell {
    height: 100%;

    .day {
      font-size: 15px;
      width: 100% !important;
    }
  }
}
</style>
