<template>
  <div class="ui-container" :style="{height: layoutHeight + 'px'}">
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      :pageNo="search.pageNo"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.gateway.search', {FIELD: 'serial'})" v-model="search.obox_serial_id"></el-input>
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.gateway.search', {FIELD: 'name'})" v-model="search.obox_name"></el-input>
          <el-select clearable class="caption-item" :placeholder="$t('smart.gateway.search', {FIELD: 'status'})" v-model="search.obox_status">
            <el-option :label="$t('smart.gateway.search', {FIELD: 'status'})" value=''></el-option>
            <el-option :label="$t('message.status', {STATUS: 'online'})" :value='1'></el-option>
            <el-option :label="$t('message.status', {STATUS: 'offline'})" :value='0'></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
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
      tableLoading: true,
      tableHeight: 0,
      total: 0,
      search: {
        obox_serial_id: '',
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
        label: this.$t('smart.gateway.tableField', {FIELD: 'serial'}),
        prop: 'obox_serial_id',
        align: 'center'
      }, {
        label: this.$t('smart.gateway.tableField', {FIELD: 'name'}),
        prop: 'obox_name',
        align: 'center'
      }, {
        label: this.$t('smart.gateway.tableField', {FIELD: 'version'}),
        prop: 'obox_version',
        align: 'center'
      }, {
        label: this.$t('smart.gateway.tableField', {FIELD: 'status'}),
        prop: 'obox_status',
        align: 'center',
        formatter (val) {
          return val ? that.$t('message.status', {STATUS: 'online'}) : that.$t('message.status', {STATUS: 'offline'})
        }
      }, {
        label: this.$t('smart.gateway.tableField', {FIELD: 'action'}),
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolbox = []
      const remove = <el-button size="tiny" icon="obicon obicon-trash" title={this.$t('message.delete')} onClick={() => this.handleRemove(row)}></el-button>
      this.$isPermited(46) && toolbox.push(remove)
      !toolbox.length && toolbox.push(<span title="">-</span>)
      return toolbox
    },
    getOboxList () {
      this.tableLoading = true
      const params = {...this.search}
      this.search.obox_status === '' && delete params.obox_status
      OboxAPI.getOboxListV2(params).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.records
          this.total = resp.total
          if (!this.tableData.length && this.search.pageNo !== 1) {
            this.search.pageNo = PAGINATION_PAGENO
            this.getOboxList()
          }
        } else {
          this.$message({
            message: this.$t('smart.obox.message', {MESSAGE: 'fetchFail'})
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
      this.$confirm(this.$t('smart.gateway.message', {MESSAGE: 'delConfirm'}), this.$t('message.tips'), {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemove(row)
      }).catch(() => {
        console.log('cancel')
      })
    },
    doRemove (row) {
      OboxAPI.deleteObox(row.obox_serial_id).then(res => {
        if (res.message.includes('success')) {
          this.$message({
            type: 'success',
            message: this.$t('smart.gateway.message', {MESSAGE: 'delDevice'}) + this.$t('message.success')
          })
        } else {
          this.$message({
            type: 'error',
            message: this.$t('smart.gateway.message', {MESSAGE: 'delDevice'}) + this.$t('message.fail')
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: this.$t('message.exception')
        })
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
</style>
