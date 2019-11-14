<template>
  <div class="expand humidifier">
    <div class="humidifier-status">
      <div class="item">
        <p><i class="obicon obicon-temperature-o"></i><span>{{$t('smart.obox.tableField', {FIELD: 'temperature'})}}</span></p>
        <span>{{temperature}}℃</span>
      </div>
      <div class="item">
        <p><i class="obicon obicon-humidity"></i><span>{{$t('smart.obox.tableField', {FIELD: 'humidifier'})}}</span></p>
        <span>{{humidifier}}%</span>
      </div>
    </div>
    <el-tabs tab-position="right" class="humidifier-table">
      <el-tab-pane :label="$t('smart.obox.message', {MESSAGE: 'history'})" style="max-height: 400px; min-height: 360px;">
        <base-table
          v-loading="tableLoading"
          stripe
          :height="tableHeight + 'px'"
          :tableData="tableData"
          :columns="columns"
          :showPagination="false"></base-table>
      </el-tab-pane>
      <el-tab-pane :label="$t('smart.obox.message', {MESSAGE: 'nowadays'})" style="width: 100%; height: 360px;max-height: 400px; min-height: 360px;">
        <HumifierChart v-if="isCharListValid" :data="series" :xAxis="labels" style="margin: 0 auto;"></HumifierChart>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import HumifierChart from './humifier-chart'
import DeviceAPI from '@/api/device'
import Helper from '@/common/helper'
export default {
  props: {
    serialId: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      tableLoading: true,
      tableHeight: 350,
      tableData: [],
      columns: [{label: this.$t('smart.obox.tableField', {FIELD: 'temperature'}), prop: 'temperature', align: 'center' }, {label: this.$t('smart.obox.tableField', {FIELD: 'humidifier'}), prop: 'humidifier', align: 'center' }, {label: this.$t('smart.obox.tableField', {FIELD: 'date'}), prop: 'time', align: 'center' }],
      isCharListValid: false,
      series: [],
      labels: [],
      temperature: 0,
      humidifier: 0
    }
  },
  components: {BaseTable, HumifierChart},
  watch: {
    serialId (val) {
      console.log(val)
      val && this.handleData(val)
    }
  },
  mounted () {
    this.handleData(this.serialId)
    this.parseState()
  },
  methods: {
    async getHumidifierStatusHistoryByWeek (serialId) {
      const now = new Date().getTime()
      const toDate = parseInt(now / 1000)
      const fromDate = parseInt((now - (6 * 24 * 60 * 60 * 1000)) / 1000)
      const {data} = await DeviceAPI.getDeviceStatusHistory(serialId, fromDate, toDate, '02')
      return this.parseHumidifierHistoryByDay(data.history, '{m}-{d}')
    },
    async getHumidifierStatusHistoryByDay (serialId) {
      const date = new Date()
      const dateObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate()
      }
      const fromDate = parseInt(new Date(`${dateObj.y}-${dateObj.m}-${dateObj.d} 00:00`).getTime() / 1000)
      const toDate = parseInt(new Date(`${dateObj.y}-${dateObj.m}-${dateObj.d} 23:59`).getTime() / 1000)
      this.tableLoading = true
      const {data} = await DeviceAPI.getDeviceStatusHistory(serialId, fromDate, toDate, '01')
      this.tableLoading = false
      return this.parseHumidifierHistoryByDay(data.history)
    },
    parseHumidifierHistoryByDay (list, fmt) {
      return Array.from(list.concat(list)).map(item => {
        const temperature = +parseInt(item.status.slice(2, 4), 16).toString(10) - 30
        const humidifier = +parseInt(item.status.slice(6, 8), 16).toString(10)
        const time = Helper.parseTime(new Date(item.time * 1000), fmt || '{h}:{i}')
        return {
          temperature,
          humidifier,
          time
        }
      })
    },
    async handleData (serialId) {
      this.dialogVisible = true
      const list = await this.getHumidifierStatusHistoryByWeek(serialId)
      const chartList = await this.getHumidifierStatusHistoryByDay(serialId)

      this.tableData = list
      const isCharListValid = chartList && chartList.length
      this.isCharListValid = isCharListValid
      if (isCharListValid) {
        this.labels = chartList.map(item => item.time)
        const temperature = chartList.map(item => item.temperature)
        const humidifier = chartList.map(item => item.humidifier)
        this.series.push({
          name: this.$t('smart.obox.tableField', {FIELD: 'temperature'}),
          type: 'line',
          data: temperature,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: '#2C3449',
              borderColor: '#45D9FF',
              borderWidth: 1,
            }
          },
          lineStyle: {
            color: '#45D9FF'
          }
        })
        this.series.push({
          name: this.$t('smart.obox.tableField', {FIELD: 'humidifier'}),
          type: 'line',
          smooth: true,
          data: humidifier,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            normal: {
              color: '#2C3449',
              borderColor: '#0FFF7B',
              borderWidth: 1,
            }
          },
          lineStyle: {
            color: '#0FFF7B'
          }
        })
      }
    },
    parseState () {
      if (!this.state) return
      this.temperature = +parseInt(this.state.slice(2, 4), 16).toString(10) - 30
      this.humidifier = +parseInt(this.state.slice(6, 8), 16).toString(10)
    }
  },
}
</script>

<style lang="scss">
.expand.humidifier {
  margin: 20px;
  padding: 20px 10px;
  // background: rgba(7, 16, 33, 0.24);
  border-radius: 20px;
  box-shadow: 0 0 2px 1px #ababab;
  position: relative;

  .humidifier-status{
    width: 30%;
    display: inline-block;
    // border: 1px solid #eee;
    vertical-align: top;
    // box-shadow: 0 0 2px 1px #f2f2f2;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    .item {
      // display: inline-block;
      // width: 50%;
      padding: 50px;
      text-align: center;
      // border-right: 1px solid #eee;
      // &:last-of-type{
      //   border-right: none;
      // }
    }
    .item p{
      padding: 5px;
      color: #666;
      span{
        font-size: 12px;
      }
    }
    .item i {
      font-size: 32px;
      // color: rgba(5, 100, 184, 0.9);
      color: #0FFF7B;

      &.obicon-temperature-o{
        color: #45D9FF;
      }
    }
    .item > span{
      display: inline-block;
      padding: 5px;
      font-size: 20px;
    }

  }
  .humidifier-table{
    display: inline-block;
    // width: 70%;
    // padding-left: 5px;
    width: 100%;
    padding-left: 30%;
  }
}
</style>
