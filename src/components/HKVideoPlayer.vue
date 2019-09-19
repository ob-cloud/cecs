<template>
  <div style="height: 300px; background: #333;">
    <div id="HKVideoPlayer"></div>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import cheerio from 'cheerio'
// import Helper from '@/common/helper'
export default {
  name: 'VideoPlayer',
  props: {
    videoId: {
      type: String,
      default: 'HKVideoPlayer'
    },
    options: {
      type: Object,
      default: () => {}
    },
    stop: {
      type: Boolean,
      default: false
    },
    ip: {
      type: String,
      default: ''
    },
    port: {
      type: Number,
      default: 80
    },
    usename: {
      type: String,
      default: 'admin'
    },
    password: {
      type: String,
      default: 'oooo1111'
    },
    iChannelID: {
      type: Number,
      default: 1
    },
    szStartTime: {
      type: String
    },
    szEndTime: {
      type: String
    },
    playType: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      player: null,
      g_iWndIndex: 0
    }
  },
  mounted () {
    setTimeout(this.initWebVideoCtrl, 0)
    // this.initWebVideoCtrl()
  },
  watch: {
    videoId (val) {
      console.log('videoId ', val)
    },
    stop (val) {
      if (val) {
        console.log('stop video')
        this.stopVideo()
      }
    },
    options: {
      deep: true,
      handler (val) {
        console.log('playType ', this.playType)
        if (this.playType === 1) {
          console.log('watch ', val)
          this.startRealPlay(val.ip, 1, val.iChannelID)
        } else {
          console.log('watch playback ', val)
          this.startPlayBack(val.ip, val.iChannelID, val.szStartTime, val.szEndTime)
        }
      }
    }
  },
  methods: {
    initWebVideoCtrl () {
      if (WebVideoCtrl.I_CheckPluginInstall() === -1) {
        return this.$confirm('您还未安装过插件，是否下载安装WebComponents.exe？', '确认提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        }).then(() => {
          // window.open('http://192.168.200.101/codebase/WebComponents.exe')
        }).catch(() => {

        })
      }
      this.initVideoWnd()
      WebVideoCtrl.I_InsertOBJECTPlugin('HKVideoPlayer')
      // this.checkPluginVersion()
      console.log(this.options)
      const loader = this.$loading({
        text: 'nvr连接中...'
      })
      this.login(this.options.ip, 1, 80, 'admin', 'oooo1111').then(res => {
        console.log('promise login ', res)
        loader.close()
        if (this.playType === 1) {
          this.startRealPlay(this.options.ip, 1, this.options.iChannelID)
        } else {
          this.startPlayBack(this.options.ip, this.options.iChannelID, this.options.szStartTime, this.options.szEndTime)
        }
      }).catch(() => {
        this.$message('NVR登陆失败')
      })
    },
    initVideoWnd () {
      const that = this
      // 初始化插件参数及插入插件
      WebVideoCtrl.I_InitPlugin(720, 300, {
        iWndowType: 1,
        cbSelWnd (xmlDoc) {
          console.log(xmlDoc)
          const $ = cheerio.load(xmlDoc)
          that.g_iWndIndex = $('SelectWnd').eq(0).text() || 0
        }
      })
    },
    checkPluginVersion () {
      // 检查插件是否最新
      if (WebVideoCtrl.I_CheckPluginVersion() === -1) {
        return this.$message('检测到新的插件版本，双击开发包目录里的WebComponents.exe升级！')
      }
    },
    login (ip, mode = 1, port = 80, username = 'admin', password = 'oooo1111') {
      return new Promise((resolve, reject) => {
        const iRet = WebVideoCtrl.I_Login(ip, mode, port, username, password, {
          async: false,
          success (xmlDoc) {
            console.log('login  ', xmlDoc)
            resolve(0)
          },
          error (e) {
            reject(e)
          }
        })
        if (iRet === 0) {
          resolve(0)
        } else if (iRet === -1) {
          resolve(-1)
        } else {
          resolve(iRet)
        }
      })
    },
    startRealPlay (ip, iStreamType = 1, iChannelID = 1) {
      const oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex)
      if (oWndInfo != null) { // 已经在播放了，先停止
        WebVideoCtrl.I_Stop()
      }
      return new Promise((resolve, reject) => {
        const ret = WebVideoCtrl.I_StartRealPlay(ip, {
          iStreamType,
          iChannelID,
          bZeroChannel: false
        })
        if (ret === 0) {
          console.log('开始预览成功！')
          resolve(0)
        } else {
          console.log('开始预览失败！')
          reject(new Error('预览失败'))
        }
      })
    },
    startPlayBack (szIP, iChannelID = 1, szStartTime, szEndTime) {
      if (!szIP) {
        console.log('ip 不能为空')
        return
      }
      const oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex)
      console.log('playback oWndInfo', oWndInfo)
      if (oWndInfo != null) { // 已经在播放了，先停止
        WebVideoCtrl.I_Stop()
      }
      return new Promise((resolve, reject) => {
        const iRet = WebVideoCtrl.I_StartPlayback(szIP, {
          iChannelID,
          szStartTime,
          szEndTime
        })
        if (iRet === 0) {
          console.log('回放成功！')
          resolve(0)
        } else {
          console.log('回放失败！')
          reject(new Error('回放失败！'))
        }
      })
    },
    stopVideo () {
      const oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex)
      if (oWndInfo != null) { // 已经在播放了，先停止
        WebVideoCtrl.I_Stop()
      }
    }
  },
  beforeDestroy () {
    console.log('destroy ')
  }
}
</script>
<style lang="css">
  .video-js{
    width: 100%;
  }
</style>
