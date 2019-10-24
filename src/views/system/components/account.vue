<template>
  <div class="smart">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading"
      :pageSize="search.pageSize"
      :pageTotal="total"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入用户名" v-model="search.userName"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入手机号码" v-model="search.mobile"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="success" icon="el-icon-refresh" @click="handleRefresh">刷新</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">创建</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog v-if="createDialogVisible" top="10%" width="660px" :title="dialogTitleMap[dialogStatus]" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form ref="creation" autoComplete="on" :rules="creationRules" :model="createModel" label-position="left" label-width="80px" style="width: 80%; margin: 0 auto;">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="createModel.userName" autoComplete="on" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="createModel.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="createModel.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select clearable class="caption-item" placeholder="选择角色" v-model="createModel.roleId" style="width: 100%;">
            <el-option :label='item.roleName' :value='item.roleId' v-for="(item, index) in roleList" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doCreate(dialogStatus)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import UserAPI from '@/api/user'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      tableLoading: false,
      tableHeight: 0,
      total: 0,
      search: {
        userName: '',
        mobile: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      dialogStatus: '',
      dialogTitleMap: {
        edit: '编辑账户',
        create: '添加账户'
      },
      createModel: {
        userName: '',
        mobile: '',
        password: '',
        roleId: ''
      },
      createDialogVisible: false,
      creationRules: {
        userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '账号密码不能为空', trigger: 'blur' }],
        roleId: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      },
      roleList: []
    }
  },
  components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getAccountList()
  },
  watch: {
    createDialogVisible (val) {
      if (val === false) {
        this.$refs.creation.resetFields()
      }
    }
  },
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight()
    },
    getColumns () {
      return [{
        label: '用户名',
        prop: 'userName',
        align: 'center'
      }, {
        label: '手机号码',
        prop: 'mobile',
        align: 'center'
      }, {
        label: '密码',
        prop: 'password',
        align: 'center',
        formatter (val) {
          return new Array(6).fill('*')
        }
      }, {
        label: '操作',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [
        <el-button size="tiny" icon="el-icon-edit" title="编辑" onClick={() => this.handleEdit(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-delete" title="删除" onClick={() => this.handleRemove(row)}></el-button>
      ]
    },
    getAccountList () {
      this.tableLoading = true
      UserAPI.getUserList(this.search).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.records
          this.total = resp.total
        } else {
          this.$message({
            message: resp.message || '用户获取失败'
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: err.message || '服务出错',
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    getRoleList () {
      UserAPI.getRoleList().then(resp => {
        if (resp.status === 0) {
          this.roleList = resp.data.records
        }
      })
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
      this.getAccountList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getAccountList()
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.search.pageSize = PAGINATION_PAGESIZE
      this.getAccountList()
    },
    resetcreateModel () {
      this.createModel = {
        userName: '',
        mobile: '',
        password: '',
        roleId: ''
      }
    },
    handleRefresh () {
      this.getAccountList()
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.createDialogVisible = true
      this.resetcreateModel()
      !this.roleList.length && this.getRoleList()
    },
    doCreate (type) {
      this.$refs.creation.validate(valid => {
        if (valid) {
          const action = type === 'create' ? 'createUser' : 'updateUser'
          UserAPI[action](this.createModel).then(res => {
            if (res.status === 0) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.createDialogVisible = false
              this.getAccountList()
            }
          }).catch(() => {
            this.createDialogVisible = false
            this.$message({
              title: '失败',
              message: '服务异常',
              type: 'error'
            })
          })
        }
      })
    },
    handleEdit (row) {
      this.dialogStatus = 'edit'
      this.createDialogVisible = true
      this.createModel = row
      this.createModel.password = ''
      !this.roleList.length && this.getRoleList()
    },
    handleRemove (row) {
      this.$confirm('确认删除账户？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        UserAPI.deleteUser(row.userId).then(res => {
          if (res.status === 0) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.getAccountList()
          }
        })
      }).catch(() => {
        console.log('取消删除')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  padding: 10px;
}
</style>
