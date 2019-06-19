<template>
  <section>
    <el-card class="toolbar" shadow="never">
      <div class="left">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="状态">
            <el-radio-group v-model="filterForm.status">
              <el-radio label="all">全部</el-radio>
              <el-radio label="wait">待审核</el-radio>
            </el-radio-group>
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

    <el-table v-loading="tableLoading" highlight-current-row :data="faces.data">
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
      :total="faces.total"
      :page-size="faces.per_page"
      :current-page="faces.current_page"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog
      title="人脸信息"
      :visible.sync="detailVisible"
      width="30%"
      center
    >
      <p>
        用户名：<b>{{ detailData.user.name }}</b>
      </p>
      <p>人脸：<img :src="detailData.info" width="100px" height="150px" /></p>
      <p>
        状态：<b>{{ statusFormat[detailData.status] }}</b>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button
          :loading="formLoading"
          type="primary"
          v-if="detailData.status === 'wait'"
          @click.native="pass"
          >通过</el-button
        >
      </span>
    </el-dialog>
  </section>
</template>

<script>
import { isMaster } from '@/utils/user'
import { faceList, faceUpdate } from '@/requests/face'

export default {
  name: 'face',
  mounted () {
    if (!isMaster()) {
      this.$router.push({ path: '/' })
    }

    this.loadFaces()
  },
  data () {
    return {
      statusFormat: {
        wait: '待审核',
        available: '可用',
        discarded: '废弃'
      },
      tableLoading: false,
      faces: {
        total: 0,
        current_page: 1,
        per_page: 0,
        data: []
      },
      filterForm: {
        status: 'all'
      },
      detailData: {
        id: 0,
        user: {
          id: 0,
          name: ''
        },
        info: '',
        status: 'wait'
      },
      detailVisible: false,
      formLoading: false
    }
  },
  methods: {
    handleCurrentChange (page) {
      this.faces.current_page = page
      this.loadFaces()
    },
    handleFilter () {
      this.loadFaces()
    },
    statusFormatter (row, column) {
      let value = row[column.property]
      return this.statusFormat[value]
    },
    loadFaces () {
      this.tableLoading = true
      let params = {
        page: this.faces.current_page
      }
      if (this.filterForm.status === 'wait') {
        params['status'] = 'wait'
      }
      faceList(params).then(res => {
        this.tableLoading = false
        this.faces.total = res.data.total
        this.faces.current_page = res.data.current_page
        this.faces.per_page = res.data.per_page
        this.faces.data = res.data.data
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '获取排班列表失败'
        })
      })
    },
    detail (row) {
      this.detailData = row
      this.detailVisible = true
    },
    pass () {
      this.formLoading = true
      faceUpdate(this.detailData.id).then(res => {
        this.formLoading = false
        this.detailVisible = false
        this.$notify({
          title: '提示',
          message: '通过成功',
          type: 'success'
        })
        this.loadFaces()
      }).catch(err => {
        this.formLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '通过失败'
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
