<template>
  <section>
    <el-table
      v-loading="tableLoading"
      highlight-current-row
      :data="leaves.data"
    >
      <el-table-column type="selection" />
      <el-table-column
        prop="id"
        label="#"
        width="100px"
        align="right"
        sortable
      />
      <el-table-column prop="user.name" label="用户名" />
      <el-table-column
        prop="start_at"
        label="开始"
        :formatter="dateFormatter"
      />
      <el-table-column prop="end_at" label="结束" :formatter="dateFormatter" />
      <el-table-column
        prop="status"
        label="状态"
        :formatter="statusFormatter"
      />
      <el-table-column label="操作" width="150px">
        <template slot-scope="props">
          <el-button size="small" @click="detail(props.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="leaves.total"
      :page-size="leaves.per_page"
      :current-page="leaves.current_page"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog
      title="加班申请详情"
      :visible.sync="detailVisible"
      width="30%"
      center
    >
      <p>
        用户名：<b>{{ detailData.user.name }}</b>
      </p>
      <p>
        开始时间：<b>{{ new Date(detailData.start_at).toLocaleString() }}</b>
      </p>
      <p>
        结束时间：<b>{{ new Date(detailData.end_at).toLocaleString() }}</b>
      </p>
      <p>
        理由：<b>{{ detailData.remark }}</b>
      </p>
      <p>
        状态：<b>{{ statusFormat[detailData.status] }}</b>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button
          :loading="formLoading"
          type="primary"
          v-if="detailData.status === 'wait'"
          @click.native="passLeave"
          >通过</el-button
        >
        <el-button
          :loading="formLoading"
          type="error"
          v-if="detailData.status === 'wait'"
          @click.native="rejectLeave"
          >拒绝</el-button
        >
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { isManager, isMaster } from '@/utils/user'
import { leaveList, leaveUpdate } from '@/requests/leave'

export default {
  name: 'leave',
  mounted () {
    if (!isManager() && !isMaster()) {
      this.$router.push({ path: '/home' })
    }

    this.loadLeaves()
  },
  data () {
    return {
      statusFormat: {
        wait: '等待审核',
        pass: '通过',
        reject: '驳回'
      },
      tableLoading: false,
      formLoading: false,
      leaves: {
        total: 0,
        current_page: 1,
        per_page: 0,
        data: []
      },
      detailData: {
        id: 0,
        user: {
          id: 0,
          name: ''
        },
        start_at: new Date(),
        end_at: new Date(),
        remark: '',
        status: 'wait'
      },
      detailVisible: false
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
    statusFormatter (row, column) {
      let value = row[column.property]
      return this.statusFormat[value]
    },
    handleCurrentChange (page) {
      this.leaves.current_page = page
      this.loadLeaves()
    },
    loadLeaves () {
      this.tableLoading = true
      leaveList(this.leaves.current_page).then(res => {
        this.tableLoading = false
        this.leaves.total = res.data.total
        this.leaves.current_page = res.data.current_page
        this.leaves.per_page = res.data.per_page
        this.leaves.data = res.data.data
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '获取请假申请列表失败'
        })
      })
    },
    detail (row) {
      this.detailData = row
      this.detailVisible = true
    },
    passLeave () {
      this.formLoading = true
      leaveUpdate(this.detailData.id, 'pass').then(res => {
        this.formLoading = false
        this.detailVisible = false
        this.$notify({
          title: '提示',
          message: '通过请假申请成功',
          type: 'success'
        })
        this.loadLeaves()
      }).catch(err => {
        this.formLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '审批请假申请失败'
        })
      })
    },
    rejectOvertime () {
      this.formLoading = true
      leaveUpdate(this.detailData.id, 'reject').then(res => {
        this.formLoading = false
        this.detailVisible = false
        this.$notify({
          title: '提示',
          message: '驳回请假申请成功',
          type: 'success'
        })
        this.loadLeaves()
      }).catch(err => {
        this.formLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '审批请假申请失败'
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
