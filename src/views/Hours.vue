<template>
  <section>
    <el-card class="toolbar" shadow="never">
      <div class="left">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="用户 ID" v-if="!isUser">
            <el-input size="small" v-model="filterForm.userId"></el-input>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="filterForm.period"
              type="datetimerange"
              size="small"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </el-form-item>
          <el-button size="small" type="primary" @click.native="handleFilter"
            >筛选</el-button
          >
        </el-form>
      </div>
      <div class="right">
        &nbsp;
      </div>
    </el-card>

    <el-table v-loading="tableLoading" highlight-current-row :data="hours.data">
      <el-table-column type="selection" />
      <el-table-column
        prop="id"
        label="#"
        width="100px"
        align="right"
        sortable
      />
      <el-table-column prop="user.name" label="用户名" />
      <el-table-column prop="hours" label="工时" />
      <el-table-column
        prop="date"
        label="记录时间"
        :formatter="dateFormatter"
      />
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="hours.total"
      :page-size="hours.per_page"
      :current-page="hours.current_page"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </section>
</template>

<script>
import { isMaster, isManager } from '@/utils/user'
import { hoursList } from '@/requests/hours'

export default {
  name: 'hours',
  data () {
    let start = new Date()
    let end = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      hours: {
        total: 0,
        current_page: 1,
        per_page: 0,
        data: []
      },
      filterForm: {
        userId: '',
        period: [start, end]
      },
      tableLoading: false
    }
  },
  mounted () {
    if (this.isUser) {
      this.filterForm.userId = this.$store.getters.user.id
    }

    this.loadHours()
  },
  computed: {
    isUser () {
      return !isMaster() && !isManager()
    }
  },
  methods: {
    dateFormatter (row, column) {
      let d = row[column.property]
      if (d === undefined) {
        return ''
      }
      return new Date(d).toLocaleString()
    },
    handleCurrentChange (page) {
      this.hours.current_page = page
      this.loadHours()
    },
    loadHours () {
      this.tableLoading = true
      let params = {
        page: this.hours.current_page,
        start_at: this.filterForm.period[0].toJSON(),
        end_at: this.filterForm.period[1].toJSON()
      }
      if (this.filterForm.userId !== '') {
        params['user_id'] = parseInt(this.filterForm.userId)
      }

      hoursList(params).then(res => {
        this.tableLoading = false
        this.hours.total = res.data.total
        this.hours.current_page = res.data.current_page
        this.hours.per_page = res.data.per_page
        this.hours.data = res.data.data
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '获取工时记录列表失败'
        })
      })
    },
    handleFilter () {
      this.loadHours()
    }
  }
}
</script>

<style lang="scss">
</style>
