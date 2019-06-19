<template>
  <section>
    <el-card class="toolbar" shadow="never">
      <div class="left">
        <el-form :inline="true" :model="filterForm">
          <el-form-item label="用户 ID">
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
        <el-button size="small" type="primary" @click="createFormVisible = true"
          >排班</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="departmentFormVisible = true"
          >部门排班</el-button
        >
        <el-button size="small" type="primary" @click="allFormVisible = true"
          >全体排班</el-button
        >
      </div>
    </el-card>

    <el-table
      v-loading="tableLoading"
      highlight-current-row
      :data="shifts.data"
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
        label="开始时间"
        :formatter="dateFormatter"
      />
      <el-table-column
        prop="end_at"
        label="结束时间"
        :formatter="dateFormatter"
      />
      <el-table-column prop="type" label="类型" :formatter="typeFormatter" />
      <el-table-column
        prop="status"
        label="状态"
        :formatter="statusFormatter"
      />
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
      :total="shifts.total"
      :page-size="shifts.per_page"
      :current-page="shifts.current_page"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <el-dialog title="排班" :visible.sync="createFormVisible">
      <el-form :model="createForm" :rules="createRules" ref="createForm">
        <el-form-item label="用户 ID" label-width="64px">
          <el-input v-model="createForm.user_id"></el-input>
        </el-form-item>
        <el-form-item label="日期" label-width="64px">
          <el-date-picker
            v-model="createForm.date"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间" label-width="64px">
          <el-time-picker
            is-range
            v-model="createForm.period"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="类型" label-width="64px">
          <el-radio-group v-model="createForm.type">
            <el-radio label="normal">正常排班</el-radio>
            <el-radio label="allovertime">全员加班</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="createLoading"
          @click.native="createShift"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="部门排班" :visible.sync="departmentFormVisible">
      <el-form
        :model="departmentForm"
        :rules="departmentRules"
        ref="departmentForm"
      >
        <el-form-item label="部门 ID" label-width="64px">
          <el-input v-model="departmentForm.department_id"></el-input>
        </el-form-item>
        <el-form-item label="日期" label-width="64px">
          <el-date-picker
            v-model="departmentForm.date"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间" label-width="64px">
          <el-time-picker
            is-range
            v-model="departmentForm.period"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="类型" label-width="64px">
          <el-radio-group v-model="departmentForm.type">
            <el-radio label="normal">正常排班</el-radio>
            <el-radio label="allovertime">全员加班</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="departmentFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="departmentLoading"
          @click.native="departmentShift"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="全体排班" :visible.sync="allFormVisible">
      <el-form :model="allForm" :rules="allRules" ref="allForm">
        <el-form-item label="日期" label-width="64px">
          <el-date-picker
            v-model="allForm.date"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间" label-width="64px">
          <el-time-picker
            is-range
            v-model="allForm.period"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="类型" label-width="64px">
          <el-radio-group v-model="allForm.type">
            <el-radio label="normal">正常排班</el-radio>
            <el-radio label="allovertime">全员加班</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="allLoading" @click.native="allShift"
          >提交</el-button
        >
      </div>
    </el-dialog>

    <el-dialog title="编辑排班" :visible.sync="editFormVisible">
      <el-form :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="日期" label-width="64px">
          <el-date-picker
            v-model="editForm.date"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="时间" label-width="64px">
          <el-time-picker
            is-range
            v-model="editForm.period"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="作用" label-width="64px">
          <el-radio-group v-model="editForm.effect">
            <el-radio label="temp">临时</el-radio>
            <el-radio label="all">永久</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="editLoading"
          @click.native="editShift"
          >提交</el-button
        >
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { isManager, isMaster } from '@/utils/user'
import { composeDateTime } from '@/utils/date'
import {
  shiftList,
  shiftDelete,
  shiftCreate,
  departmentShift,
  allShift,
  editShift
} from '@/requests/shift'

export default {
  name: 'shift',
  data () {
    let start = new Date()
    let end = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)

    const validateUserId = (rule, value, callback) => {
      if (parseInt(value) < 1) {
        callback(new Error('用户 ID 不合法'))
      } else {
        callback()
      }
    }

    const validateDepartmentId = (rule, value, callback) => {
      if (parseInt(value) < 1) {
        callback(new Error('部门 ID 不合法'))
      } else {
        callback()
      }
    }

    const validateType = (rule, value, callback) => {
      if (value !== 'normal' && value !== 'allovertime') {
        callback(new Error('类型不合法'))
      } else {
        callback()
      }
    }

    const validateEffect = (rule, value, callback) => {
      if (value !== 'temp' && value !== 'all') {
        callback(new Error('作用范围不合法'))
      } else {
        callback()
      }
    }

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
      filterForm: {
        userId: '',
        period: [start, end]
      },
      shifts: {
        total: 0,
        current_page: 1,
        per_page: 0,
        data: []
      },
      createFormVisible: false,
      createForm: {
        user_id: '',
        date: new Date(),
        period: [new Date(), new Date()],
        type: 'normal'
      },
      createRules: {
        user_id: [{ required: true, trigger: 'blur', validator: validateUserId }],
        type: [{ required: true, trigger: 'blur', validator: validateType }]
      },
      departmentFormVisible: false,
      departmentForm: {
        department_id: '',
        date: new Date(),
        period: [new Date(), new Date()],
        type: 'normal'
      },
      departmentRules: {
        department_id: [{ required: true, trigger: 'blur', validator: validateDepartmentId }],
        type: [{ required: true, trigger: 'blur', validator: validateType }]
      },
      allFormVisible: false,
      allForm: {
        date: new Date(),
        period: [new Date(), new Date()],
        type: 'normal'
      },
      allRules: {
        type: [{ required: true, trigger: 'blur', validator: validateType }]
      },
      tableLoading: false,
      createLoading: false,
      departmentLoading: false,
      allLoading: false,
      editLoading: false,
      editForm: {
        id: 0,
        date: new Date(),
        period: [new Date(), new Date()],
        effect: 'temp'
      },
      editRules: {
        effect: [{ required: true, trigger: 'blur', validator: validateEffect }]
      },
      editFormVisible: false
    }
  },
  mounted () {
    if (!isManager() && !isMaster()) {
      this.$router.push({ path: '/home' })
    }

    this.loadShifts()
  },
  methods: {
    dateFormatter (row, column) {
      let d = row[column.property]
      if (d === undefined) {
        return ''
      }
      return new Date(d).toLocaleString()
    },
    typeFormatter (row, column) {
      let value = row[column.property]
      if (value === 'allovertime') {
        return '全员加班'
      } else {
        return '正常排班'
      }
    },
    statusFormatter (row, column) {
      let value = row[column.property]
      if (value === 'no') {
        return '未签到'
      } else if (value === 'on') {
        return '已签到'
      } else if (value === 'off') {
        return '已签退'
      } else if (value === 'leave') {
        return '请假'
      } else {
        return '未知'
      }
    },
    handleCurrentChange (page) {
      this.shifts.current_page = page
      this.loadShifts()
    },
    handleFilter () {
      this.loadShifts()
    },
    loadShifts () {
      this.tableLoading = true
      let params = {
        page: this.shifts.current_page,
        start_at: this.filterForm.period[0].toJSON(),
        end_at: this.filterForm.period[1].toJSON()
      }
      if (this.filterForm.userId !== '') {
        params['user_id'] = parseInt(this.filterForm.userId)
      }
      if (isManager()) {
        params['department_id'] = this.$store.getters.user.department
      }
      shiftList(params).then(res => {
        this.tableLoading = false
        this.shifts.total = res.data.total
        this.shifts.current_page = res.data.current_page
        this.shifts.per_page = res.data.per_page
        this.shifts.data = res.data.data
      }).catch(err => {
        this.tableLoading = false
        console.log(err)
        this.$notify.error({
          title: '提示',
          message: '获取排班列表失败'
        })
      })
    },
    handleEdit (row) {
      this.editForm.id = row.id
      this.editForm.date = new Date(row.start_at)
      this.editForm.period[0] = new Date(row.start_at)
      this.editForm.period[1] = new Date(row.end_at)
      this.editFormVisible = true
    },
    handleDelete (row) {
      this.$confirm('确认删除排班：' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        shiftDelete(row.id).then(() => {
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success'
          })
          this.loadShifts()
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
    createShift () {
      this.createLoading = true
      this.$refs.createForm.validate(valid => {
        if (valid) {
          let startAt = composeDateTime(this.createForm.date, this.createForm.period[0])
          let endAt = composeDateTime(this.createForm.date, this.createForm.period[1])

          shiftCreate(this.createForm.user_id, startAt, endAt, this.createForm.type).then(res => {
            if (res.status === 201) {
              this.createLoading = false
              this.$notify({
                title: '提示',
                message: '添加成功',
                type: 'success'
              })
              this.loadShifts()
              this.createFormVisible = false
            } else {
              this.createLoading = false
              this.$notify.error({
                title: '提示',
                message: '添加失败，错误代码：' + res.status
              })
            }
          }).catch(err => {
            this.createLoading = false
            console.log(err)
            this.$notify.error({
              title: '提示',
              message: '添加排班失败'
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
    departmentShift () {
      this.departmentLoading = true
      this.$refs.departmentForm.validate(valid => {
        if (valid) {
          let startAt = composeDateTime(this.departmentForm.date, this.departmentForm.period[0])
          let endAt = composeDateTime(this.departmentForm.date, this.departmentForm.period[1])

          departmentShift(this.departmentForm.department_id, startAt, endAt, this.departmentForm.type).then(res => {
            if (res.status === 201) {
              this.departmentLoading = false
              this.$notify({
                title: '提示',
                message: '添加成功',
                type: 'success'
              })
              this.loadShifts()
              this.departmentFormVisible = false
            } else {
              this.departmentLoading = false
              this.$notify.error({
                title: '提示',
                message: '添加失败，错误代码：' + res.status
              })
            }
          }).catch(err => {
            this.departmentLoading = false
            console.log(err)
            this.$notify.error({
              title: '提示',
              message: '添加排班失败'
            })
          })
        } else {
          this.departmentLoading = false
          this.$notify.error({
            title: '提示',
            message: '数据格式错误'
          })
        }
      })
    },
    allShift () {
      this.allLoading = true
      this.$refs.allForm.validate(valid => {
        if (valid) {
          let startAt = composeDateTime(this.allForm.date, this.allForm.period[0])
          let endAt = composeDateTime(this.allForm.date, this.allForm.period[1])

          allShift(startAt, endAt, this.allForm.type).then(res => {
            if (res.status === 201) {
              this.allLoading = false
              this.$notify({
                title: '提示',
                message: '添加成功',
                type: 'success'
              })
              this.loadShifts()
              this.allFormVisible = false
            } else {
              this.allLoading = false
              this.$notify.error({
                title: '提示',
                message: '添加失败，错误代码：' + res.status
              })
            }
          }).catch(err => {
            this.allLoading = false
            console.log(err)
            this.$notify.error({
              title: '提示',
              message: '添加排班失败'
            })
          })
        } else {
          this.allLoading = false
          this.$notify.error({
            title: '提示',
            message: '数据格式错误'
          })
        }
      })
    },
    editShift () {
      this.editLoading = true
      this.$refs.editForm.validate(valid => {
        if (valid) {
          let startAt = composeDateTime(this.editForm.date, this.editForm.period[0])
          let endAt = composeDateTime(this.editForm.date, this.editForm.period[1])

          editShift(this.editForm.id, startAt, endAt, this.editForm.effect).then(res => {
            if (res.status === 200) {
              this.editLoading = false
              this.$notify({
                title: '提示',
                message: '编辑成功',
                type: 'success'
              })
              this.loadShifts()
              this.editFormVisible = false
            } else {
              this.editLoading = false
              this.$notify.error({
                title: '提示',
                message: '编辑失败，错误代码：' + res.status
              })
            }
          }).catch(err => {
            this.editLoading = false
            console.log(err)
            this.$notify.error({
              title: '提示',
              message: '编辑排班失败'
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
    }
  }
}
</script>

<style lang="scss">
</style>
