<template>
  <div class="page-container">
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="searchModel.pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="NVR名称" v-model="searchModel.name"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="IP地址" v-model="searchModel.ip"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="序列号" v-model="searchModel.serialId"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
        </template>
      </slot>
    </base-table>

    <el-dialog top="10%" width="760px" :title="nvrAction" :visible.sync="createNVRVisible" :close-on-click-modal="false">
      <el-form ref="nvrForm" :rules="nvrModelRules" :model="nvrModel" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input class="caption-item w8" placeholder="输入NVR名称" v-model="nvrModel.name"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input class="caption-item w8" placeholder="输入NVR IP地址" v-model="nvrModel.ip"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input class="caption-item w8" placeholder="输入NVR 端口" v-model="nvrModel.port"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="user">
          <el-input class="caption-item w8" placeholder="输入NVR 登录账号" v-model="nvrModel.user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input class="caption-item w8" placeholder="输入NVR登录密码" v-model="nvrModel.pwd"></el-input>
        </el-form-item>
        <el-form-item label="序列号" prop="serialId">
          <el-input class="caption-item w8" placeholder="输入NVR 序列号" :disabled="nvrAction === '编辑NVR'" v-model="nvrModel.serialId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center" >
        <el-button @click="createNVRVisible = false">取 消</el-button>
        <el-button type="primary" @click="doCreateAction">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import NVRAPI from '@/api/nvr'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  name: 'nvr-list',
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: true,
      tableData: [],
      columns: [],
      createNVRVisible: false,
      nvrModel: {
        name: '',
        ip: '',
        port: '',
        user: '',
        pwd: '',
        serialId: ''
      },
      searchModel: {
        name: '',
        ip: '',
        serialId: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      nvrModelRules: {
        name: [{ required: true, trigger: 'blur', message: 'nvr名称不能为空'}],
        ip: [{ required: true, trigger: 'blur', message: 'IP不能为空'}],
        port: [{ required: true, trigger: 'blur', message: '端口不能为空'}],
        user: [{ required: true, trigger: 'blur', message: '账号不能为空'}],
        pwd: [{ required: true, trigger: 'blur', message: '密码不能为空'}],
        serialId: [{ required: true, trigger: 'blur', message: '序列号不能为空'}],
      },
      nvrAction: '添加NVR'
    }
  },
  components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getNvrList()
  },
  computed: {
    total () {
      return this.tableData.length || 0
    }
  },
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 50
    },
    getColumns () {
      return [{
        label: '设备名称',
        prop: 'name',
        align: 'center'
      }, {
        label: '序列号',
        prop: 'serialId',
        align: 'center'
      }, {
        label: 'IP',
        prop: 'ip',
        align: 'center'
      }, {
        label: '端口',
        prop: 'port',
        align: 'center'
      }, {
        label: '账号名',
        prop: 'user',
        align: 'center'
      }, {
        label: '创建时间',
        prop: 'createTime',
        align: 'center'
      }, {
        label: '操作',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolboxs = []
      const edit = <el-button size="tiny" icon="el-icon-edit" onClick={() => this.handleEdit(row)}></el-button>
      const remove = <el-button size="tiny" icon="el-icon-delete" onClick={() => this.handleDelete(row)}></el-button>
      toolboxs.push(edit)
      toolboxs.push(remove)
      return toolboxs
    },
    getNvrList () {
      this.tableLoading = true
      NVRAPI.getNvrList().then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.list
        } else {
          this.$message({
            message: resp.message || 'NVR 列表获取失败'
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
    onCurrentChange (pageNo) {
      this.searchModel.pageNo = pageNo
      this.getNvrList()
    },
    onSizeChange (pageSize) {
      this.searchModel.pageSize = pageSize
      this.getNvrList()
    },
    responseHandler (res, msg) {
      let message = `${msg}失败`
      let type = 'error'
      if (res.message.includes('success')) {
        type = 'success'
        message = `${msg}成功`
      }
      this.$message({
        type,
        message
      })
    },
    handleSearch () {
      this.getNvrList(this.nvrModel.ip, this.nvrModel.name, this.nvrModel.serialId)
    },
    handleCreate () {
      this.createNVRVisible = true
      this.nvrAction = '添加NVR'
    },
    doCreateAction () {
      this.$refs.nvrForm.validate(valid => {
        if (valid) {
          NVRAPI.createNvrRecord(this.nvrModel).then(res => {
            this.responseHandler(res, '添加NVR')
            if (res.message.includes('success')) {
              this.createNVRVisible = false
              this.getNvrList()
            }
          }).catch(err => {
            this.responseHandler({message: 'error'}, '添加NVR')
          })
        }
      })
    },
    handleEdit (nvr) {
      this.createNVRVisible = true
      this.nvrAction = '编辑NVR'
    },
    handleDelete (nvr) {
      this.$confirm('确认删除NVR记录？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemoveAction(nvr)
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doRemoveAction (nvr) {
      NVRAPI.removeNvrRecord(nvr.serialId).then(res => {
        this.responseHandler(res, 'NVR删除')
        if (res.message.includes('success')) {
          this.getNvrList()
        }
      }).catch(() => {
        this.responseHandler({message: 'error'}, 'NVR删除')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  width: 94%;
  margin: 12px auto;
}
.w8{
  width: 80%;
}
</style>
