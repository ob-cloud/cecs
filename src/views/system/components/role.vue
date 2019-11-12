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
          <el-input @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.role.search', {FIELD: 'name'})" v-model="search.roleName"></el-input>
          <el-select clearable class="caption-item" :placeholder="$t('smart.role.search', {FIELD: 'status'})" v-model="search.status">
            <el-option :label="$t('smart.role.search', {FIELD: 'status'})" value=''></el-option>
            <el-option :label="$t('smart.role.action', {FIELD: 'enable'})" :value='0'></el-option>
            <el-option :label="$t('smart.role.action', {FIELD: 'disable'})" :value='1'></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="success" icon="el-icon-refresh" @click="handleRefresh">{{$t('message.refresh')}}</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">{{$t('message.create')}}</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog v-if="createDialogVisible" top="10%" width="660px" :title="dialogTitleMap[dialogStatus]" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form ref="createRole" autoComplete="on" :rules="creationRules" :model="createModel" label-position="left" label-width="80px" style="width: 80%; margin: 0 auto;">
        <el-form-item :label="$t('smart.role.form', {FIELD: 'label'})" prop="roleName">
          <el-input v-model="createModel.roleName" autoComplete="on" :placeholder="$t('smart.role.form', {FIELD: 'name'})"></el-input>
        </el-form-item>
        <el-form-item :label="$t('smart.role.form', {FIELD: 'auth'})" prop="auth">
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
        <el-button @click="createDialogVisible = false">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="doCreate(dialogStatus)">{{$t('message.confirm')}}</el-button>
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
        edit: this.$t('smart.role.action', {FIELD: 'edit'}),
        create: this.$t('smart.role.action', {FIELD: 'create'})
      },
      createModel: {
        roleName: '',
        privilegeWeight: '',
        parentPrivilegeWeight: ''
      },
      createDialogVisible: false,
      creationRules: {
        roleName: [{ required: true, message: this.$t('message.rules', {FIELD: 'roleName'}), trigger: 'blur' }]
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
      const that = this
      return [{
        label: this.$t('smart.role.tableField', {FIELD: 'serial'}),
        prop: 'roleId',
        align: 'center'
      }, {
        label: this.$t('smart.role.tableField', {FIELD: 'name'}),
        prop: 'roleName',
        align: 'center'
      }, {
        label: this.$t('smart.role.tableField', {FIELD: 'status'}),
        prop: 'status',
        align: 'center',
        formatter (val) {
          return val === 0 ? that.$t('smart.role.action', {FIELD: 'enable'}) : that.$t('smart.role.action', {FIELD: 'disable'})
        }
      }, {
        label: this.$t('smart.role.tableField', {FIELD: 'action'}),
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const status = row.status === 0 ? this.$t('smart.role.action', {FIELD: 'disable'}) : this.$t('smart.role.action', {FIELD: 'enable'})
      return [
        <el-button size="tiny" type="warning" title={status} onClick={() => this.handleEnable(row)}>{status}</el-button>,
        <el-button size="tiny" type="primary" title={this.$t('message.edit')} onClick={() => this.handleEdit(row)}>{this.$t('message.edit')}</el-button>,
        <el-button size="tiny" type="danger" title={this.$t('message.delete')} onClick={() => this.handleRemove(row)}>{this.$t('message.delete')}</el-button>
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
            message: this.$t('smart.role.message', {MESSAGE: 'fetchFail'})
          })
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
        this.$message({
          type: 'error',
          message: this.$t('message.exception'),
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
                message: this.$t('message.actionSuccess'),
              })
              this.getRoleList()
              this.createDialogVisible = false
            } else {
              this.$message({
                type: 'error',
                message: this.$t('message.actionFail'),
              })
            }
          }).catch(e => {
            this.$message({
              type: 'error',
              message: this.$t('message.exception'),
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
            message: this.$t('smart.role.message', {MESSAGE: 'statusUpdate'})
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
      this.$confirm(this.$t('smart.role.message', {MESSAGE: 'delConfirm'}), this.$t('message.tips'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doDelete(row)
      }).catch(() => {
        console.log('cancel')
      })
    },
    doDelete (row) {
      UserAPI.deleteRole(row.roleId).then(response => {
        if (response.status === 0) {
          this.getRoleList()
        } else {
          this.$message({
            type: 'error',
            message: this.$t('message.actionFail')
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: this.$t('message.exception')
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
