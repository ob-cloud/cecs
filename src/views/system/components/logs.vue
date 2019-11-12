<template>
  <div class="device smart  ui-container" :style="{height: layoutHeight + 'px'}">
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.logrecords.search', {FIELD: 'operator'})" v-model="search.operator"></el-input>
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.logrecords.search', {FIELD: 'description'})" v-model="search.sysDesc"></el-input>
          <el-select clearable class="caption-item" :placeholder="$t('smart.logrecords.search', {FIELD: 'type'})" v-model="search.sysType">
            <el-option :label="$t('smart.logrecords.search', {FIELD: 'type'})" value=''></el-option>
            <el-option :label="$t('smart.logrecords.search', {FIELD: 'device'})" value='设备管理'></el-option>
            <el-option :label="$t('smart.logrecords.search', {FIELD: 'scene'})" value='场景管理'></el-option>
            <el-option :label="$t('smart.logrecords.search', {FIELD: 'user'})" value='用户管理'></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
        </template>
      </slot>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import SystemAPI from '@/api/system'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
export default {
  props: {
    height: {
      type: Number,
      default: 0
    },
    layoutHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: false,
      tableHeight: 0,
      search: {
        sysType: '',
        operator: '',
        sysDesc: '',
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
    // Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 20
    },
    getColumns () {
      return [{
        label: this.$t('smart.logrecords.tableField', {FIELD: 'serial'}),
        prop: 'id',
        align: 'center'
      }, {
        label: this.$t('smart.logrecords.tableField', {FIELD: 'type'}),
        prop: 'sysType',
        align: 'center'
      }, {
        label: this.$t('smart.logrecords.tableField', {FIELD: 'action'}),
        prop: 'sysDesc',
        align: 'center'
      }, {
        label: this.$t('smart.logrecords.tableField', {FIELD: 'datetime'}),
        prop: 'sysTime',
        align: 'center',
        formatter (val) {
          return val && Helper.parseTime(val)
        }
      }, {
        label: this.$t('smart.logrecords.tableField', {FIELD: 'operator'}),
        prop: 'operator',
        align: 'center',
      }]
    },
    getLogsList () {
      this.tableLoading = true
      SystemAPI.getSysLogs(this.search).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.records
        } else {
          this.$message({
            message: this.$t('smart.logrecords.message', {MESSAGE: 'fetchFail'})
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
