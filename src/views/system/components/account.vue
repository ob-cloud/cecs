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
          <el-input @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.account.search', {FIELD: 'name'})" v-model="search.userName"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.account.search', {FIELD: 'phone'})" v-model="search.mobile"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="success" icon="el-icon-refresh" @click="handleRefresh">{{$t('message.refresh')}}</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">{{$t('message.create')}}</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog v-if="createDialogVisible" top="10%" width="660px" :title="dialogTitleMap[dialogStatus]" :visible.sync="createDialogVisible" :close-on-click-modal="false">
      <el-form ref="creation" autoComplete="on" :rules="creationRules" :model="createModel" label-position="left" label-width="80px" style="width: 80%; margin: 0 auto;">
        <el-form-item :label="$t('smart.account.tableField', {FIELD: 'name'})" prop="userName">
          <el-input v-model="createModel.userName" autoComplete="on" :placeholder="$t('smart.account.form', {FIELD: 'name'})"></el-input>
        </el-form-item>
        <el-form-item :label="$t('smart.account.form', {FIELD: 'mobile'})" prop="mobile">
          <el-input v-model="createModel.mobile" :placeholder="$t('smart.account.form', {FIELD: 'phone'})"></el-input>
        </el-form-item>
        <el-form-item :label="$t('smart.account.tableField', {FIELD: 'pwd'})" prop="password">
          <el-input type="password" v-model="createModel.password" :placeholder="$t('smart.account.form', {FIELD: 'pwd'})"></el-input>
        </el-form-item>
        <el-form-item :label="$t('smart.account.form', {FIELD: 'roleName'})" prop="roleId">
          <el-select clearable class="caption-item" :placeholder="$t('smart.account.form', {FIELD: 'role'})" v-model="createModel.roleId" style="width: 100%;">
            <el-option :label='item.roleName' :value='item.roleId' v-for="(item, index) in roleList" :key="index"></el-option>
          </el-select>
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
import BaseTable from '@/assets/package/table-base'
import UserAPI from '@/api/user'
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
        userName: '',
        mobile: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      dialogStatus: '',
      dialogTitleMap: {
        edit: this.$t('smart.account.action', {FIELD: 'edit'}),
        create: this.$t('smart.account.action', {FIELD: 'create'})
      },
      createModel: {
        userName: '',
        mobile: '',
        password: '',
        roleId: ''
      },
      createDialogVisible: false,
      creationRules: {
        userName: [{ required: true, message: this.$t('message.rules', {RULE: 'user'}), trigger: 'blur' }],
        mobile: [{ required: true, message: this.$t('message.rules', {RULE: 'phone'}), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('message.rules', {RULE: 'pwd'}), trigger: 'blur' }],
        roleId: [{ required: true, message: this.$t('message.rules', {RULE: 'role'}), trigger: 'blur' }]
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
        label: this.$t('smart.account.tableField', {FIELD: 'name'}),
        prop: 'userName',
        align: 'center'
      }, {
        label: this.$t('smart.account.tableField', {FIELD: 'phone'}),
        prop: 'mobile',
        align: 'center'
      }, {
        label: this.$t('smart.account.tableField', {FIELD: 'pwd'}),
        prop: 'password',
        align: 'center',
        formatter (val) {
          return new Array(6).fill('*')
        }
      }, {
        label: this.$t('smart.account.tableField', {FIELD: 'action'}),
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [
        <el-button size="tiny" icon="el-icon-edit" title={this.$t('message.edit')} onClick={() => this.handleEdit(row)}></el-button>,
        <el-button size="tiny" icon="el-icon-delete" title={this.$t('message.delete')} onClick={() => this.handleRemove(row)}></el-button>
      ]
    },
    getAccountList () {
      this.tableLoading = true
      UserAPI.getUserList(this.search).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.records
          this.total = resp.total
          if (!this.tableData.length && this.search.pageNo !== 1) {
            this.search.pageNo = PAGINATION_PAGENO
            this.getAccountList()
          }
        } else {
          this.$message({
            message: this.$t('smart.account.message', {MESSAGE: 'fetchFail'})
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: this.$t('message.fail'),
          message: this.$t('message.exception'),
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    getRoleList () {
      UserAPI.getRoleList({status: 0}).then(resp => {
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
      this.search.pageNo = PAGINATION_PAGENO
      this.search.pageSize = PAGINATION_PAGESIZE
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
                message: this.$t('message.actionSuccess')
              })
              this.createDialogVisible = false
              this.getAccountList()
            }
          }).catch(() => {
            this.createDialogVisible = false
            this.$message({
              title: this.$t('message.fail'),
              message: this.$t('message.exception'),
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
      this.$confirm(this.$t('smart.account.message', {MESSAGE: 'delConfirm'}), this.$t('message.tips'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        UserAPI.deleteUser(row.userId).then(res => {
          if (res.status === 0) {
            this.$message({
              type: 'success',
              message: this.$t('message.actionSuccess')
            })
            this.getAccountList()
          }
        })
      }).catch(() => {
        console.log('cancel')
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
