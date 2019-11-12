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
        <template slot="actionBar">
          <el-date-picker
            v-model="pickerValue"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            :start-placeholder="$t('smart.exportrecords.search', {FIELD: 'start'})"
            :end-placeholder="$t('smart.exportrecords.search', {FIELD: 'end'})"
            align="right">
          </el-date-picker>
          <el-button type="primary" icon="obicon obicon-cloud-download" @click="handleExport">{{$t('message.exports')}}</el-button>
        </template>
      </slot>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
// import SystemAPI from '@/api/system'
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
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      pickerOptions: {
        shortcuts: [{
          text: this.$t('smart.exportrecords.search', {FIELD: 'week'}),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 7))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('smart.exportrecords.search', {FIELD: 'month'}),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 30))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('smart.exportrecords.search', {FIELD: 'months'}),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 90))
            picker.$emit('pick', [start, end])
          }
        }]
      },
      pickerValue: '',
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
        label: this.$t('smart.exportrecords.tableField', {FIELD: 'serial'}),
        prop: 'id',
        align: 'center'
      }, {
        label: this.$t('smart.exportrecords.tableField', {FIELD: 'name'}),
        prop: 'sysType',
        align: 'center'
      }, {
        label: this.$t('smart.exportrecords.tableField', {FIELD: 'daterange'}),
        prop: 'sysDesc',
        align: 'center'
      }, {
        label: this.$t('smart.exportrecords.tableField', {FIELD: 'datetime'}),
        prop: 'sysTime',
        align: 'center',
        formatter (val) {
          return val && Helper.parseTime(val)
        }
      }, {
        label: this.$t('smart.exportrecords.tableField', {FIELD: 'operator'}),
        prop: 'operator',
        align: 'center',
      }]
    },
    getLogsList () {
      // this.tableLoading = true
      // SystemAPI.getSysLogs(this.search).then(resp => {
      //   if (resp.status === 0) {
      //     this.tableData = resp.data.records
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
    },
    handleExport () {
      console.log(this.pickerValue)
    }
  }
}
</script>
