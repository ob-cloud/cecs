<template>
  <el-container style="height: 500px; border: 1px solid #282A39">
      <el-aside width="200px" style="background-color: #282A39">
        <iot-lamp :color="lampColor"></iot-lamp>
      </el-aside>
      <el-main class="main-content">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>异常状态：{{this.exceptionText}}</span>
          </div>
          <div class="card-content">
            <el-row :gutter="40" class="card-content__item">
              <el-col :span="3">
                <span>开关</span>
              </el-col>
              <el-col :span="16" style="text-align: left;">
                <el-switch
                  v-model="power"
                  inactive-color="#DC143C"
                  active-text="开"
                  inactive-text="关"
                  @change="onPowerChange">
                </el-switch>
              </el-col>
            </el-row>
            <el-row :gutter="40" class="card-content__item">
              <el-col :span="3">
                <span>亮度</span>
              </el-col>
              <el-col :span="16">
                <el-slider v-model="bright" :marks="{0: '0', 100: '100'}" :disabled="!isPowerOn" :show-input="true" :show-input-controls="false" input-size="mini" @change="onBrightChange"></el-slider>
              </el-col>
            </el-row>
            <el-row :gutter="40" class="card-content__item" v-if="isColorLamp()">
              <el-col :span="3">
                <span>色度</span>
              </el-col>
              <el-col :span="16">
                <el-slider v-model="color" :min="0" :max="254" :disabled="!isPowerOn" :marks="{0: '0', 254: '254'}" :show-input="true" :show-input-controls="false" input-size="mini" @change="onColorChange"></el-slider>
              </el-col>
            </el-row>
            <!-- <div class="card-content__item">
              <span class="demonstration">亮度</span>
              <el-slider v-model="bright" :marks="{0: '0', 100: '100'}"></el-slider>
            </div>
            <div class="card-content__item">
              <span class="demonstration">色度</span>

            </div> -->
          </div>
        </el-card>
        <!-- <div class="toolbox">
          <el-button>取消</el-button>
          <el-button type="primary" @click="setLamp">确认</el-button>
        </div> -->
      </el-main>
    </el-container>
</template>

<script>
import IotLamp from '@/components/IotLamp'
import DeviceAPI from '@/api/device'
export default {
  props: {
    status: {
      type: String,
      default: ''
    },
    serialId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  components: {
    IotLamp
  },
  data () {
    return {
      power: false,
      bright: 0,
      color: 0,
      lampColor: '#fff',
      exception: ''
    }
  },
  watch: {
    power (power) {
      // #f4f980 f5ff07
      this.lampColor = power ? 'rgba(244, 255, 0, 0.6)' : '#666'
    },
    bright (bright) {
      // console.log(' === ', bright)
      const alpha = (bright / 100 * 0.4) + 0.6
      this.lampColor = this.power ? `rgba(244, 255, 0, ${alpha})` : this.lampColor
    },
    color (color) {
      // console.log('color  ', color)
    }
  },
  computed: {
    isPowerOn () {
      return this.power
    },
    exceptionText () {
      const bits = this.exception.split('')
      if (!bits || !bits.length) return '无异常'
      return bits[0] === '1' ? '开路' : bits[1] === '1' ? '短路' : '无异常'
    }
  },
  mounted () {
    this.power = this.status.slice(0, 2) !== '00'
    this.bright = this.getBrightDecimal()
    this.color = this.getColorDecimal() // 100 - (parseInt(this.status.slice(2, 4), 16) / 2.55)
    this.exception = this.status.slice(14) || '00'
  },
  methods: {
    isColorLamp () {
      return this.type === '02'
    },
    getBrightDecimal (status) {
      const state = status || this.status
      const brightValue = +parseInt(state.slice(0, 2), 16).toString(16)
      // return Math.ceil(brightValue / 255 * 100)
      return brightValue - 154 < 0 ? 154 : brightValue - 154
    },
    getBrightHex (bright) {
      // const hexValue = Math.ceil(bright * 255 / 100)
      const hexValue = bright + 154
      console.log('bright ', hexValue)
      const hex = parseInt(hexValue, 10).toString(16)
      return hex.length > 1 ? hex : '0' + hex
    },
    getColorHex (color = 0) {
      // const hexValue = Math.ceil(color * 254 / 100)
      const hexValue = color + 154
      const hex = parseInt(hexValue, 10).toString(16)
      return hex.length > 1 ? hex : '0' + hex
    },
    getColorDecimal (status) {
      const state = status || this.status
      const brightValue = +parseInt(state.slice(2, 4), 16).toString(16)
      // return Math.ceil(brightValue / 254 * 100)
      return brightValue - 154 < 0 ? 154 : brightValue - 154
    },
    onPowerChange (power) {
      const powerHex = power ? 'fe' : '00'
      let state = ''
      this.bright = !power ? 0 : 100
      if (this.isColorLamp()) {
        // let color = (255 - Math.round(this.color * 2.55)).toString(16)
        // color = color.length > 1 ? color : '0' + color
        const color = this.getColorHex(this.color)
        state = powerHex + color + 'fe0000000200'
      } else {
        state = powerHex + '00000000000200'
      }
      this.setSwtich(state)
    },
    onBrightChange (bright) {
      if (bright === 0) (this.power = false)
      const brightValue = this.getBrightHex(bright)
      let state = ''

      if (this.isColorLamp()) {
        // let color = (255 - Math.round(this.color * 2.55)).toString(16)
        // color = color.length > 1 ? color : '0' + color
        const color = this.getColorHex(this.color)
        state = brightValue + color + 'fe0000000200'
      } else {
        state = brightValue + '00000000000200'
      }
      this.setSwtich(state)
    },
    onColorChange (color) {
      const brightValue = this.getBrightHex(this.bright)
      let state = ''
      if (this.isColorLamp()) {
        const colorHex = this.getColorHex(color)
        state = brightValue + colorHex + 'fe0000000200'
      } else {
        state = brightValue + '00000000000200'
      }
      this.setSwtich(state)
    },
    setSwtich (status) {
      DeviceAPI.setSwitchStatus(this.serialId, status).then(res => {
        if (res.message.includes('success')) {
          this.$message({
            type: 'success',
            message: '成功'
          })
          // this.getSwitchStatus()
        } else {
          this.$message({
            type: 'error',
            message: '失败'
          })
        }
      })
    },
    getSwitchStatus () {
      DeviceAPI.getSwitchStatus(this.serialId).then(res => {
        if (res.message.includes('success')) {
          this.$message({
            type: 'success',
            message: res.message
          })
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.card-content__item{
  padding: 30px 24px;
  border-bottom: 1px solid #3A4257;

  > div{
    text-align: right;
    line-height: 38px;
  }
}
.toolbox{
  position: absolute;
  left: 212px;
  right: 0;
  bottom: 0;
  text-align: right;
  padding: 6px;
  padding-right: 30px;
  background: #2C3449;
}
</style>
