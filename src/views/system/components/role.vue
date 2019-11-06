<template>
  <div class="ui-container">
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageSize="search.pageSize"
      :pageNo="search.pageNo"
      :pageTotal="total"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入角色名称" v-model="search.roleName"></el-input>
          <el-select clearable class="caption-item" placeholder="角色使用状态" v-model="search.status">
            <el-option label='全部' value=''></el-option>
            <el-option label='启用' :value='0'></el-option>
            <el-option label='停用' :value='1'></el-option>
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
      <el-form ref="createRole" autoComplete="on" :rules="creationRules" :model="createModel" label-position="left" label-width="80px" style="width: 80%; margin: 0 auto;">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="createModel.roleName" autoComplete="on" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" prop="auth">
          <el-tree
            ref="authTree"
            :data="authList"
            show-checkbox
            node-key="id"
            :default-expand-all="false"
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
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: false,
      tableHeight: 0,
      total: 0,
      search: {
        status: '',
        roleName: '',
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
        privilegeWeight: '',
        parentPrivilegeWeight: ''
      },
      createDialogVisible: false,
      creationRules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      authList: [],
      defaultProps: {
        label: 'name',
        children: 'privilege'
      }
    }
  },
  components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getRoleList()
    this.getAuthList()
  },
  watch: {
    createDialogVisible (val) {
      if (val === false) {
        this.$refs.createRole.resetFields()
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
          return val === 0 ? '启用' : '停用'
        }
      }, {
        label: '操作',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [
        <el-button size="tiny" type="warning" title="启用" onClick={() => this.handleEnable(row)}>{row.status === 0 ? '停用' : '启用'}</el-button>,
        <el-button size="tiny" type="primary" title="编辑" onClick={() => this.handleEdit(row)}>编辑</el-button>,
        <el-button size="tiny" type="danger" title="删除" onClick={() => this.handleRemove(row)}>删除</el-button>
      ]
    },
    getRoleList () {
      this.tableLoading = true
      const {status, roleName, pageNo, pageSize} = this.search
      const params = status === '' ? {roleName, pageNo, pageSize} : {status, roleName, pageNo, pageSize}
      UserAPI.getRoleList(params).then(res => {
        if (res.status === 0) {
          this.tableData = res.data.records
          this.total = res.total
          if (!this.tableData.length && this.search.pageNo !== 1) {
            this.search.pageNo = PAGINATION_PAGENO
            this.getRoleList()
          }
        } else {
          this.$message({
            type: 'error',
            message: '获取角色列表失败'
          })
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
        this.$message({
          type: 'error',
          message: '服务异常'
        })
      })
    },
    getAuthList () {
      UserAPI.getPrivilege().then(resp => {
        if (resp.status === 0) {
          this.authList = resp.data.records.privilege
        }
      })
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
        roleName: '',
        privilegeWeight: '',
        parentPrivilegeWeight: ''
      }
    },
    handleRefresh () {
      this.search.pageNo = PAGINATION_PAGENO
      this.search.pageSize = PAGINATION_PAGESIZE
      this.getRoleList()
    },
    handleCreate () {
      this.dialogStatus = 'create'
      this.createDialogVisible = true
      this.resetcreateModel()
    },
    doCreate (type) {
      this.$refs.createRole.validate(valid => {
        if (valid) {
          const privilege = this.parsePrivilege()
          this.createModel.parentPrivilegeWeight = privilege.parentPrivilegeWeight
          this.createModel.privilegeWeight = privilege.privilegeWeight
          const action = type === 'create' ? 'createRole' : 'updateRole'
          const {roleId, roleName, parentPrivilegeWeight, privilegeWeight} = this.createModel
          UserAPI[action]({roleId, roleName, parentPrivilegeWeight, privilegeWeight}).then(res => {
            if (res.status === 0) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.getRoleList()
              this.createDialogVisible = false
            }
          }).catch(e => {
            this.$message({
              type: 'error',
              message: e.message || '服务异常'
            })
          })
        }
      })
    },
    parsePrivilege () {
      let parentPrivilegeWeight = 0
      let privilegeWeight = 0
      const checkAuthList = this.getCheckedNodes(true)
      Array.from(checkAuthList).forEach(item => {
        const parentAuth = this.authList.find(auth => auth.id === item.parentId)
        parentPrivilegeWeight += parentAuth.weight
        privilegeWeight += item.weight
      })
      return {
        parentPrivilegeWeight,
        privilegeWeight
      }
    },
    handleEnable (row) {
      UserAPI.updateRoleStatus(row.roleId, +(!row.status)).then(res => {
        if (res.status === 0) {
          row.status = +(!row.status)
          this.$message({
            type: 'success',
            message: '状态更新成功'
          })
        }
      })
    },
    handleEdit (row) {
      this.dialogStatus = 'edit'
      this.createDialogVisible = true
      const { roleId, roleName, privilege } = {...row}
      this.createModel = {roleId, roleName, privilege}
      console.log('==== ', privilege)
      // setTimeout(() => {
      //   this.setCheckedNodes(privilege)
      // }, 0)
      this.$nextTick(() => {
        this.setCheckedNodes(privilege)
      })
    },
    handleRemove (row) {
      this.$confirm('确认删除角色？', '确认提示', {
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
      UserAPI.deleteRole(row.roleId).then(response => {
        if (response.status === 0) {
          this.getRoleList()
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
    },
    getCheckedNodes (leafOnly) {
      return this.$refs.authTree.getCheckedNodes(leafOnly)
    },
    setCheckedNodes (nodes) {
      let subnodes = []
      Array.from(nodes).forEach(item => {
        subnodes = subnodes.concat(item.privilege)
      })
      console.log('subnodes ', subnodes)
      return this.$refs.authTree.setCheckedNodes(subnodes)
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  padding: 10px;
}
</style>
