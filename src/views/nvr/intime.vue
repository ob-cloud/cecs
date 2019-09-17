<template>
  <div>
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading">
    </base-table>
    <el-dialog  v-if="videoDialogVisible" top="10%" width="760px" title="录像回放" :visible.sync="videoDialogVisible" :close-on-click-modal="false" @close="closeVideo">
      <div style="padding: 8px;">
        <span>录像时段：</span><span>{{`${videoOptions.szStartTime} - ${videoOptions.szEndTime}`}}</span>
      </div>
      <video-player :playType="2" :stop="stopVideo" :options="videoOptions"></video-player>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import { PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
import { mapGetters } from 'vuex'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import VideoPlayer from '@/components/HKVideoPlayer.vue'
export default {
  name: 'nvr-push',
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      columns: [],
      pageSize: PAGINATION_PAGESIZE,
      videoOptions: {
        ip: '',
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
  },
  computed: {
    total () {
      return this.tableData.length || 0
    },
    ...mapGetters([
      'token'
    ])
  },
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
    // this.initWebSocket()
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 50
    },
    getColumns () {
      return [{
        label: '设备名称',
        prop: 'deviceName',
        align: 'center'
      }, {
        label: 'IP',
        prop: 'ip',
        minWidth: '100px',
        align: 'center'
      }, {
        label: '端口',
        prop: 'port',
        align: 'center'
      }, {
        label: '开始时间',
        prop: 'startTime',
        minWidth: '180px',
        align: 'center',
        formatter (val) {
          return val ? Helper.parseTime(val) : ''
        }
      }, {
        label: '结束时间',
        prop: 'endTime',
        minWidth: '180px',
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
      const play = <el-button size="tiny" icon="el-icon-caret-right" onClick={() => this.playVideo(row)}></el-button>
      toolboxs.push(play)
      return toolboxs
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
    },
    playVideo (row) {
      this.videoDialogVisible = true
      this.stopVideo = false
      this.videoOptions.ip = row.ip
      this.videoOptions.iChannelID = row.channel || 1
      this.videoOptions.szStartTime = Helper.parseTime(row.startTime)
      this.videoOptions.szEndTime = Helper.parseTime(row.endTime)
      console.log('回放时段： ', Helper.parseTime(row.startTime), Helper.parseTime(row.endTime))
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
    initWebSocket () {
      const that = this
      this.connection()
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          that.stompClient.send('test')
        } catch (err) {
          that.connection()
        }
      }, 3600000)
    },
    connection () {
      const that = this
      try {
        const socket = new SockJS('https://192.168.200.254/queueServer') // http://192.168.200.254:8901/queueServer
        // var socket = new SockJS(process.env.VUE_APP_BASE_API  + "/consumer/queueServer");
        this.stompClient = Stomp.over(socket)
        this.stompClient.connect(
          {},
          frame => {
            this.stompClient.subscribe(
              `/user/${this.token}/setNvrRecode`,
              response => {
                console.log('----- ', response)
                try {
                  const record = JSON.parse(response.body)
                  that.tableData.unshift(record)
                } catch (error) {
                  console.log('推送解析失败', error)
                }
              },
              { ack: 'client-individual' }
            )
          },
          err => {
            console.log(err)
          }
        )
      } catch (error) {
        console.log(error)
      }
    },
    disconnect () {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
    },
    closeVideo () {
      this.stopVideo = true
    }
  },
  beforeDestroy () {
    this.disconnect()
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.smart{
  width: 94%;
  margin: 12px auto;
}
</style>
