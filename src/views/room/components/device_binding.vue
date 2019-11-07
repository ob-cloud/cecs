<template>
  <div class="smart">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @current-change="onSelectionChange"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.room.tableField', {FIELD: 'obxSerial'})" v-model="search.oboxSerialId"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
        </template>
      </slot>
    </base-table>
  </div>
</template>

<script>
// const {default: Suit} = require('@/common/suit')
import BaseTable from '@/assets/package/table-base'
import DeviceAPI from '@/api/device'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
const {default: Suit} = require('@/common/suit')
export default {
  name: 'room-device-binding',
  data () {
    return {
      tableLoading: true,
      tableHeight: 500,
      total: 0,
      search: {
        oboxSerialId: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: []
    }
  },
  components: { BaseTable },
  // computed: {
  //   total () {
  //     return this.tableData.length || 0
  //   }
  // },
  mounted () {
    this.columns = this.getColumns()
    this.getDeviceList()
  },
  methods: {
    getColumns () {
      const that = this
      return [{
        label: this.$t('smart.room.tableField', {FIELD: 'option'}),
        align: 'center',
        renderBody (h) {
          return (
            <el-radio value="0"></el-radio>
          )
        }
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'obxSerial'}),
        prop: 'obox_serial_id',
        align: 'center'
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'serial'}),
        prop: 'serialId',
        align: 'center'
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'name'}),
        prop: 'name',
        align: 'center'
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'status'}),
        prop: 'state',
        align: 'center',
        formatter (status, row) {
          if (Suit.typeHints.isThreeKeySocketSwitch(row.deviceChildType)) {
            return status === '0' ? that.$t('message.status', {STATUS: 'off'}) : that.$t('message.status', {STATUS: 'on'})
          }
          return '-'
          // return status && Suit.getStatusDescriptor(status, row.device_type, row.device_child_type)
        }
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'type'}),
        prop: 'device_type',
        align: 'center',
        formatter (val) {
          return val && Suit.getRootDeviceDescriptor(val)
        }
      }, {
        label: this.$t('smart.room.tableField', {FIELD: 'subtype'}),
        prop: 'device_child_type',
        align: 'center',
        formatter (val, row) {
          return (val && row.device_type) && Suit.getDeviceTypeDescriptor(row.device_type, val)
        }
      }]
    },
    getDeviceList () {
      this.tableLoading = true
      DeviceAPI.getAllBuildingDeviceList(this.search).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.records
          this.total = resp.total
        } else {
          this.$message({
            message: this.$t('smart.obox.message', {MESSAGE: 'fetchFail'}),
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
      this.getDeviceList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getDeviceList()
    },
    onSelectionChange (selections) {
      this.$emit('selection', selections)
    },
    handleSearch () {
      this.getDeviceList()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
