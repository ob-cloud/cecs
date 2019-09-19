<template>
  <div>
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="pageSize"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
    </base-table>
    <el-dialog v-if="videoDialogVisible" top="10%" width="760px" title="录像回放" :visible.sync="videoDialogVisible" :close-on-click-modal="false" @close="closeVideo">
      <div style="padding: 8px;">
        <span>录像时段：</span><span>{{`${videoOptions.szStartTime} - ${videoOptions.szEndTime}`}}</span>
      </div>
      <video-player videoId="historyVideo" :playType="2" :stop="stopVideo" :options="videoOptions"></video-player>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import NVRAPI from '@/api/nvr'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import VideoPlayer from '@/components/HKVideoPlayer.vue'
import Helper from '@/common/helper'
export default {
  name: 'nvr-history',
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
      pageNo: PAGINATION_PAGENO,
      pageSize: PAGINATION_PAGESIZE,
      videoOptions: {
        ip: '',
        port: '',
        iChannelID: 1,
        szStartTime: '',
        szEndTime: ''
      },
      videoDialogVisible: false,
      stopVideo: false
    }
  },
  components: { BaseTable, VideoPlayer },
  created () {
    this.columns = this.getColumns()
    this.getDeviceList()
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
        label: '通道',
        prop: 'channel',
        align: 'center'
      }, {
        label: '设备名称',
        prop: 'deviceName',
        align: 'center'
      }, {
        label: 'IP',
        prop: 'ip',
        align: 'center'
      }, {
        label: '开始时间',
        prop: 'startTime',
        align: 'center',
        formatter (val) {
          return val ? Helper.parseTime(val) : ''
        }
      }, {
        label: '结束时间',
        prop: 'endTime',
        align: 'center',
        formatter (val) {
          return val ? Helper.parseTime(val) : ''
        }
      }, {
        label: '操作',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolboxs = []
      const edit = <el-button size="tiny" icon="el-icon-caret-right" onClick={() => this.playback(row)}></el-button>
      toolboxs.push(edit)
      return toolboxs
    },
    getDeviceList () {
      this.tableLoading = true
      NVRAPI.getNvrHisotryList().then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.list
        } else {
          this.$message({
            message: resp.message || '设备获取失败'
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
      this.pageNo = pageNo
      this.getDeviceList()
    },
    onSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getDeviceList()
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
    playback (row) {
      this.videoDialogVisible = true
      this.stopVideo = false
      this.videoOptions.ip = row.ip
      this.videoOptions.iChannelID = row.channel || 1
      this.videoOptions.port = row.port
      this.videoOptions.szStartTime = Helper.parseTime(row.startTime)
      this.videoOptions.szEndTime = Helper.parseTime(row.endTime)
      console.log(row)
      console.log('回放时段： ', Helper.parseTime(row.startTime), Helper.parseTime(row.endTime))
    },
    closeVideo () {
      this.stopVideo = true
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
