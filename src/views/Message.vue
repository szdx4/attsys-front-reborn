<template>
  <section>
    <el-table
      v-loading="tableLoading"
      highlight-current-row
      :data="messages.data"
    >
      <el-table-column type="selection" />
      <el-table-column
        prop="id"
        label="#"
        width="100px"
        align="right"
        sortable
      />
      <el-table-column prop="from.name" label="发件人" />
      <el-table-column prop="title" label="标题" />
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
      :total="messages.total"
      :page-size="messages.per_page"
      :current-page="messages.current_page"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog
      title="查看信息"
      :visible.sync="detailVisible"
      width="30%"
      center
    >
      <p>
        发件人：<b>{{ detailData.from.name }}</b>
      </p>
      <p>
        标题：<b>{{ detailData.title }}</b>
      </p>
      <p>
        内容：<b>{{ detailData.content }}</b>
      </p>
    </el-dialog>
  </section>
</template>

<script>
import { messageList, messageShow } from '@/requests/message'

export default {
  name: 'message',
  mounted () {
    this.loadMessages()
  },
  data () {
    return {
      statusFormat: {
        unread: '未读',
        read: '已读'
      },
      tableLoading: false,
      messages: {
        total: 0,
        current_page: 1,
        per_page: 0,
        data: []
      },
      detailData: {
        id: 0,
        from: {
          id: 0,
          name: ''
        },
        to: {
          id: 0,
          name: ''
        },
        title: '',
        status: 'unread'
      },
      detailVisible: false
    }
  },
  methods: {
    handleCurrentChange (page) {
      this.messages.current_page = page
      this.loadMessages()
    },
    statusFormatter (row, column) {
      let value = row[column.property]
      return this.statusFormat[value]
    },
    loadMessages () {
      this.tableLoading = true
      messageList(this.$store.getters.user.id, this.messages.current_page).then(res => {
        this.tableLoading = false
        this.messages.total = res.data.total
        this.messages.current_page = res.data.current_page
        this.messages.per_page = res.data.per_page
        this.messages.data = res.data.data
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '获取信息列表失败'
        })
      })
    },
    detail (row) {
      messageShow(row.id).then(res => {
        this.loadMessages()
        this.detailData = res.data.data
        this.detailVisible = true
      }).catch(err => {
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '设置已读状态失败'
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
