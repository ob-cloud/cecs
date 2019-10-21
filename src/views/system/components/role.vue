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
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入角色名称" v-model="search.roleName"></el-input>
          <el-select clearable class="caption-item" placeholder="角色使用状态" v-model="search.status">
            <el-option label='全部' value=''></el-option>
            <el-option label='启用' :value='1'></el-option>
            <el-option label='停用' :value='0'></el-option>
          </el-select>
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="createModel.roleName" autoComplete="on" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop="auth">
          <el-tree
            :data="authList"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="defaultProps">
          </el-tree>
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
import UserAPI from '@/api/user'
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
        edit: '编辑角色',
        create: '创建角色'
      },
      createModel: {
        roleName: '',
        auth: []
      },
      createDialogVisible: false,
      creationRules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      authList: [
        {
          id: 1,
          name: '用户管理',
          children: [{
            id: 9,
            name: '账户管理'
          }, {
            id: 19,
            name: '角色管理'
          }]
        }
      ],
      defaultProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getRoleList()
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
        prop: 'roleId',
        align: 'center'
      }, {
        label: '角色名称',
        prop: 'roleName',
        align: 'center'
      }, {
        label: '状态',
        prop: 'status',
        align: 'center',
        formatter (val) {
          return val ? '启用' : '停用'
        }
      }, {
        label: '操作',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [
        <el-button size="tiny" title="启用" onClick={() => this.handleEdit(row)}>{row.status ? '启用' : '停用'}</el-button>,
        <el-button size="tiny" title="编辑" onClick={() => this.handleEdit(row)}>编辑</el-button>,
        <el-button size="tiny" title="删除" onClick={() => this.handleRemove(row)}>删除</el-button>
      ]
    },
    getRoleList () {
      this.tableLoading = true
      UserAPI.getRoleList(this.search.roleName, this.search.status).then(res => {
        if (res.status === 0) {
          console.log('role  ', res)
          this.tableData = res.data.records
        } else {
          this.$message({
            type: 'success',
            message: res.message || '获取失败'
          })
        }
        this.tableLoading = false
      })
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
      this.getRoleList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getRoleList()
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.search.pageSize = PAGINATION_PAGESIZE
      this.getRoleList()
    },
    resetcreateModel () {
      this.createModel = {
        room: '',
        building: '',
        layer: ''
      }
    },
    handleRefresh () {
      this.getRoleList()
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
        //
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doDelete (row) {
      RoomAPI.deleteRoom(row).then(response => {
        if (response.status === 200) {
          this.getAccountList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '删除失败~~'
        })
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
