<template>
  <div class="device smart">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="序列号" v-model="search.obox_serial_id"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="名称" v-model="search.obox_name"></el-input>
          <el-select clearable class="caption-item" placeholder="全部" v-model="search.obox_status">
            <el-option label='全部' value=''></el-option>
            <el-option label='在线' :value='1'></el-option>
            <el-option label='不在线' :value='0'></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
      </slot>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import OboxAPI from '@/api/obox'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      tableLoading: true,
      tableHeight: 0,
      search: {
        serialId: '',
        obox_name: '',
        obox_status: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: []
    }
  },
  components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getOboxList()
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
      this.tableHeight = Helper.calculateTableHeight()
    },
    getColumns () {
      return [{
        label: '序列号',
        prop: 'obox_serial_id',
        align: 'center'
      }, {
        label: '名称',
        prop: 'obox_name',
        align: 'center'
      }, {
        label: '版本',
        prop: 'obox_version',
        align: 'center'
      }, {
        label: '状态',
        prop: 'obox_status',
        align: 'center',
        formatter (val) {
          return val ? '在线' : '不在线'
        }
      }, {
        label: '操作',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      return [
        <el-button size="tiny" icon="obicon obicon-trash" title="删除" onClick={() => this.handleRemove(row)}></el-button>
      ]
    },
    getOboxList () {
      this.tableLoading = true
      OboxAPI.getOboxList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.oboxs
        } else {
          this.$message({
            message: resp.message || '场景获取失败'
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
      this.search.pageNo = pageNo
      this.getOboxList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getOboxList()
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.getOboxList()
    },
    handleRemove (row) {
      this.$confirm('确认删除OBOX？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemove()
      }).catch(() => {
        console.log('取消删除')
      })
    },
    doRemove () {
      // const loading = this.$loading({
      //   lock: true,
      //   text: 'obox升级中...'
      // })
      // setTimeout(() => {
      //   loading.close()
      // }, 1500)
      // console.log('升级操作')
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  width: 94%;
  margin: 12px auto;
}
</style>
