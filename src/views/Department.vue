<template>
  <section>
    <el-card class="toolbar" shadow="never">
      <div class="left">
        &nbsp;
      </div>
      <div class="right">
        <el-button size="small" type="primary" @click="createFormVisible = true"
          >新增部门</el-button
        >
      </div>
    </el-card>

    <el-table
      v-loading="tableLoading"
      highlight-current-row
      :data="departments.data"
    >
      <el-table-column type="selection" />
      <el-table-column
        prop="id"
        label="#"
        width="100px"
        align="right"
        sortable
      />
      <el-table-column prop="name" label="名称" />
      <el-table-column label="操作" width="150px">
        <template slot-scope="props">
          <el-button size="small" @click="handleEdit(props.row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(props.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="departments.total"
      :page-size="departments.per_page"
      :current-page="departments.current_page"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog title="新增部门" :visible.sync="createFormVisible">
      <el-form :model="createForm" :rules="rules" ref="createForm">
        <el-form-item label="名称" label-width="64px">
          <el-input v-model="createForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="createLoading"
          @click.native="createDepartment"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="编辑部门" :visible.sync="editFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="名称" label-width="64px">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="editLoading"
          @click.native="editDepartment"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  departmentList,
  departmentDelete,
  departmentCreate,
  departmentSave
} from '@/requests/department'
import { isMaster } from '@/utils/user'

export default {
  name: 'department',
  data () {
    const validateName = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('部门名称必须大于 4 位'))
      } else {
        callback()
      }
    }
    return {
      tableLoading: false,
      departments: {
        total: 0,
        current_page: 0,
        per_page: 0,
        data: []
      },
      rules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }]
      },
      createFormVisible: false,
      createForm: {
        id: 0,
        name: ''
      },
      createLoading: false,
      editFormVisible: false,
      editForm: {
        id: 0,
        name: ''
      },
      editLoading: false
    }
  },
  mounted () {
    if (!isMaster()) {
      this.$router.push({ path: '/home' })
    }

    this.loadDepartments()
  },
  methods: {
    handleCurrentChange (page) {
      this.departments.current_page = page
      this.loadDepartments()
    },
    loadDepartments () {
      this.tableLoading = true
      departmentList(this.departments.current_page).then(res => {
        this.tableLoading = false
        this.departments.total = res.data.total
        this.departments.current_page = res.data.current_page
        this.departments.per_page = res.data.per_page
        this.departments.data = res.data.data
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '获取部门列表失败'
        })
      })
    },
    handleEdit (row) {
      this.editForm.id = row.id
      this.editForm.name = row.name
      this.editFormVisible = true
    },
    handleDelete (row) {
      this.$confirm('确认删除部门：' + row.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        departmentDelete(row.id).then(() => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.loadDepartments()
        }).catch(err => {
          console.log(err)
          this.$notify.error({
            title: '提示',
            message: '删除失败'
          })
        })
      }).catch(() => {
        this.$notify.info({
          title: '提示',
          message: '已取消'
        })
      })
    },
    createDepartment () {
      this.createLoading = true
      this.$refs.createForm.validate(valid => {
        if (valid) {
          departmentCreate(this.createForm.name).then(res => {
            if (res.status === 201) {
              this.createLoading = false
              this.$notify({
                title: '提示',
                message: '添加成功',
                type: 'success'
              })
              this.loadDepartments()
              this.createFormVisible = false
            } else {
              this.createLoading = false
              this.$notify.error({
                title: '提示',
                message: '添加部门失败，错误代码：' + res.status
              })
            }
          }).catch(err => {
            this.createLoading = false
            console.log(err)
            this.$notify.error({
              title: '提示',
              message: '添加部门失败'
            })
          })
        } else {
          this.createLoading = false
          this.$notify.error({
            title: '提示',
            message: '部门名称格式错误'
          })
        }
      })
    },
    editDepartment () {
      this.editLoading = true
      this.$refs.editForm.validate(valid => {
        if (valid) {
          departmentSave(this.editForm.id, this.editForm.name).then(res => {
            if (res.status === 200) {
              this.editLoading = false
              this.$notify({
                title: '提示',
                message: '编辑成功',
                type: 'success'
              })
              this.loadDepartments()
              this.editFormVisible = false
            } else {
              this.editLoading = false
              this.$notify.error({
                title: '提示',
                message: '编辑部门失败'
              })
            }
          }).catch(err => {
            this.editLoading = false
            console.log(err)
            this.$notify.error({
              title: '提示',
              message: '编辑部门失败'
            })
          })
        } else {
          this.editLoading = false
          this.$notify.error({
            title: '提示',
            message: '部门名称格式错误'
          })
        }
      })
      this.editFormVisible = false
    }
  }
}
</script>

<style lang="sass">
</style>
