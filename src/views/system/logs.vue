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
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="执行人" v-model="search.operator"></el-input>
          <el-select clearable class="caption-item" placeholder="类型" v-model="search.type">
            <el-option label='全部' value=''></el-option>
            <el-option label='设备管理' :value='0'></el-option>
            <el-option label='场景管理' :value='1'></el-option>
            <el-option label='用户管理' :value='2'></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
      </slot>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
// import OboxAPI from '@/api/obox'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  data () {
    return {
      tableLoading: false,
      tableHeight: 0,
      search: {
        type: '',
        operator: '',
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
    this.getLogsList()
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
        label: '序号',
        prop: 'id',
        align: 'center'
      }, {
        label: '类型',
        prop: 'type',
        align: 'center'
      }, {
        label: '操作',
        prop: 'action',
        align: 'center'
      }, {
        label: '时间',
        prop: 'time',
        align: 'center'
      }, {
        label: '执行人',
        prop: 'operator',
        align: 'center',
      }]
    },
    getLogsList () {
      // this.tableLoading = true
      // OboxAPI.getLogsList(this.search).then(resp => {
      //   if (resp.status === 200) {
      //     this.tableData = resp.data.oboxs
      //   } else {
      //     this.$message({
      //       message: resp.message || '场景获取失败'
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
      this.getLogsList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getLogsList()
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.getLogsList()
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
