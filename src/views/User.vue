<template>
  <section>
    <el-card class="toolbar" shadow="never">
      <div class="left">
        &nbsp;
      </div>
      <div class="right">
        <el-button size="small" type="primary" @click="createFormVisible = true"
          >新增用户</el-button
        >
        <el-button size="small" type="primary" @click="batchFormVisible = true"
          >批量新增用户</el-button
        >
      </div>
    </el-card>

    <el-table v-loading="tableLoading" highlight-current-row :data="users.data">
      <el-table-column type="selection" />
      <el-table-column
        prop="id"
        label="#"
        width="100px"
        align="right"
        sortable
      />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="department.name" label="部门" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="hours" label="工时" />
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
      :total="users.total"
      :page-size="users.per_page"
      :current-page="users.current_page"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog title="新增用户" :visible.sync="createFormVisible">
      <el-form :model="createForm" :rules="rules" ref="createForm">
        <el-form-item label="用户名" label-width="64px">
          <el-input v-model="createForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="64px">
          <el-input v-model="createForm.password"></el-input>
        </el-form-item>
        <el-form-item label="部门 ID" label-width="64px">
          <el-input v-model="createForm.department"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="createLoading"
          @click.native="createUser"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="editFormVisible">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="用户名" label-width="64px">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="部门 ID" label-width="64px">
          <el-input v-model="editForm.department"></el-input>
        </el-form-item>
        <el-form-item label="身份" label-width="64px">
          <el-radio-group v-model="editForm.role">
            <el-radio label="user"></el-radio>
            <el-radio label="manager"></el-radio>
            <el-radio label="master"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工时" label-width="64px">
          <el-input v-model="editForm.hours"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="editLoading"
          @click.native="editUser"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="批量添加用户" :visible.sync="batchFormVisible">
      <el-form>
        <el-form-item label="文件" label-width="64px">
          <el-upload
            action=""
            ref="batchFile"
            :multiple="false"
            :limit="1"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="batchLoading"
          @click.native="batchAdd"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  userList,
  userDelete,
  userCreate,
  userEdit,
  userBatch
} from '@/requests/user'
import { isMaster } from '@/utils/user'
import { Base64 } from 'js-base64'

export default {
  name: 'user',
  data () {
    const validateName = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('用户名必须大于 4 位'))
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
    const validateDepartment = (rule, value, callback) => {
      if (parseInt(value) < 1) {
        callback(new Error('部门 ID 必须为正整数'))
      } else {
        callback()
      }
    }
    const validateRole = (rule, value, callback) => {
      if (!['user', 'manager', 'master'].includes(value)) {
        callback(new Error('用户角色不合法'))
      } else {
        callback()
      }
    }
    const validateHours = (rule, value, callback) => {
      if (parseInt(value) < 0) {
        callback(new Error('工时必须为整数'))
      } else {
        callback()
      }
    }
    return {
      createFormVisible: false,
      batchFormVisible: false,
      editFormVisible: false,
      tableLoading: false,
      users: {
        total: 0,
        current_page: 1,
        per_page: 0,
        data: []
      },
      createLoading: false,
      editLoading: false,
      batchLoading: false,
      createForm: {
        name: '',
        password: '',
        department: ''
      },
      editForm: {
        id: 0,
        name: '',
        department: '',
        role: '',
        hours: ''
      },
      rules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        department: [{ required: true, trigger: 'blur', validator: validateDepartment }]
      },
      editRules: {
        name: [{ required: true, trigger: 'blur', validator: validateName }],
        department: [{ required: true, trigger: 'blur', validator: validateDepartment }],
        role: [{ required: true, trigger: 'blur', validator: validateRole }],
        hours: [{ required: true, trigger: 'blur', validator: validateHours }]
      }
    }
  },
  mounted () {
    if (!isMaster()) {
      this.$router.push({ path: '/home' })
    }

    this.loadUsers()
  },
  methods: {
    loadUsers () {
      this.tableLoading = true
      userList(this.users.current_page).then(res => {
        this.tableLoading = false
        this.users.total = res.data.total
        this.users.current_page = res.data.current_page
        this.users.per_page = res.data.per_page
        this.users.data = res.data.data
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '获取用户列表失败'
        })
      })
    },
    handleCurrentChange (page) {
      this.users.current_page = page
      this.loadUsers()
    },
    handleEdit (row) {
      this.editForm.id = row.id
      this.editForm.name = row.name
      this.editForm.department = row.department.id
      this.editForm.role = row.role
      this.editForm.hours = row.hours
      this.editFormVisible = true
    },
    handleDelete (row) {
      this.$confirm('确认删除用户：' + row.name, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userDelete(row.id).then(() => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.loadUsers()
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
    createUser () {
      this.createLoading = true
      this.$refs.createForm.validate(valid => {
        if (valid) {
          userCreate(this.createForm.name, this.createForm.password, this.createForm.department).then(res => {
            if (res.status === 201) {
              this.createLoading = false
              this.$notify({
                title: '提示',
                message: '添加成功',
                type: 'success'
              })
              this.loadUsers()
              this.createFormVisible = false
            } else {
              this.createLoading = false
              this.$notify.error({
                title: '提示',
                message: '添加用户失败，错误代码：' + res.status
              })
            }
          }).catch(err => {
            this.createLoading = false
            console.log(err)
            this.$notify.error({
              title: '提示',
              message: '添加用户失败'
            })
          })
        } else {
          this.createLoading = false
          this.$notify.error({
            title: '提示',
            message: '数据格式错误'
          })
        }
      })
    },
    editUser () {
      this.editLoading = true
      this.$refs.editForm.validate(valid => {
        if (valid) {
          userEdit(this.editForm.id, this.editForm.name, this.editForm.department, this.editForm.role, this.editForm.hours).then(res => {
            if (res.status === 200) {
              this.editLoading = false
              this.$notify({
                title: '提示',
                message: '编辑成功',
                type: 'success'
              })
              this.loadUsers()
              this.editFormVisible = false
            } else {
              this.editLoading = false
              this.$notify.error({
                title: '提示',
                message: '编辑用户失败'
              })
            }
          }).catch(err => {
            this.editLoading = false
            console.log(err)
            this.$notify.error({
              title: '提示',
              message: '编辑用户失败'
            })
          })
        } else {
          this.editLoading = false
          this.$notify.error({
            title: '提示',
            message: '数据格式错误'
          })
        }
      })
    },
    batchAdd () {
      this.batchLoading = true
      let file = this.$refs.batchFile.uploadFiles[0]
      if (file && file.size > 0) {
        if (window.FileReader) {
          const reader = new FileReader()
          reader.readAsText(file.raw, 'utf-8')
          reader.onloadend = (evt) => {
            if (evt.target.readyState === FileReader.DONE) {
              var csvBase64 = Base64.encode(evt.target.result)
              userBatch(csvBase64).then(res => {
                this.batchLoading = false
                this.batchFormVisible = false
                const successCount = res.data.filter((item) => {
                  return item.status === 201
                }).length
                const failCount = res.data.filter((item) => {
                  return item.status !== 201
                }).length
                this.$notify({
                  title: '提示',
                  message: '提交成功，其中 ' + successCount + ' 条成功，' + failCount + ' 条失败',
                  type: 'success'
                })
                this.loadUsers()
              }).catch(err => {
                this.batchLoading = false
                console.log(err)
                this.$notify.error({
                  title: '提示',
                  message: '批量添加用户失败'
                })
              })
            }
          }
        } else {
          this.batchLoading = false
          this.$notify.error({
            title: '提示',
            message: '浏览器不支持'
          })
        }
      } else {
        this.batchLoading = false
        this.$notify.error({
          title: '提示',
          message: '请选择正确的文件'
        })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
