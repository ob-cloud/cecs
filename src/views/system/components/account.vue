<template>
  <div class="smart">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading"
      :pageSize="search.pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入用户名" v-model="search.username"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入手机号码" v-model="search.phone"></el-input>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="createModel.username" autoComplete="on" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="createModel.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="createModel.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select clearable class="caption-item" placeholder="选择角色" v-model="search.roleId">
            <el-option label='全部' value=''></el-option>
            <el-option label='超级管理员' :value='0'></el-option>
            <el-option label='控制员' :value='1'></el-option>
            <el-option label='审计员' :value='2'></el-option>
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
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      tableLoading: false,
      tableHeight: 0,
      search: {
        room: '',
        building: '',
        layer: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      dialogStatus: '',
      dialogTitleMap: {
        edit: '房间编辑',
        create: '创建房间'
      },
      createModel: {
        username: '',
        phone: '',
        password: '',
        roleId: ''
      },
      createDialogVisible: false,
      creationRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '账号密码不能为空', trigger: 'blur' }],
        roleId: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      }
    }
  },
  components: { BaseTable },
  created () {
    this.columns = this.getColumns()
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
        label: '序号',
        prop: '',
        align: 'center'
      }, {
        label: '用户名',
        prop: 'username',
        align: 'center'
      }, {
        label: '手机号码',
        prop: 'phone',
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
        <el-button size="tiny" icon="el-icon-edit" title="编辑" onClick={() => this.handleEdit(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-delete" title="删除" onClick={() => this.handleRemove(row)}></el-button>
      ]
    },
    getAccountList () {
      // this.tableLoading = true
      // RoomAPI.getAccountList(this.search).then(resp => {
      //   if (resp.status === 200) {
      //     this.tableData = resp.data.locations
      //   } else {
      //     this.$message({
      //       message: resp.message || '房间获取失败'
      //     })
      //   }
      //   this.tableLoading = false
      // }).catch(err => {
      //   this.$message({
      //     title: '失败',
      //     message: err.message || '服务出错',
      //     type: 'error'
      //   })
      //   this.tableLoading = false
      // })
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
        room: '',
        building: '',
        layer: ''
      }
    },
    handleRefresh () {
      this.getAccountList()
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.createDialogVisible = true
      this.resetcreateModel()
    },
    doCreate (type) {
      this.$refs.creation.validate(valid => {
        // if (valid) {
        //   type === 'create' ? this.createAction() : this.editAction()
        //   this.createDialogVisible = false
        // }
      })
    },
    handleEdit (row) {
      this.dialogStatus = 'edit'
      this.createDialogVisible = true
      this.createModel = row
    },
    handleRemove (row) {
      this.$confirm('确认删除房间？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doDelete(row)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doDelete (row) {
      // RoomAPI.deleteRoom(row).then(response => {
      //   if (response.status === 200) {
      //     this.getAccountList()
      //   } else {
      //     this.$message({
      //       type: 'error',
      //       message: '删除失败!'
      //     })
      //   }
      // }).catch(() => {
      //   this.$message({
      //     type: 'error',
      //     message: '删除失败~~'
      //   })
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  padding: 10px;
}
</style>
