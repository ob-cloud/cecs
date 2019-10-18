<template>
  <v-chart :options="line"/>
</template>
<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

export default {
  components: {'v-chart': ECharts},
  props: ['data', 'xAxis'],
  data () {
    return {
      line: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: ['温度', '湿度']
        },
        xAxis: [{
          type: 'category',
          data: this.xAxis
        }],
        yAxis: [{
          type: 'value',
          name: '温度',
          min: 0,
          max: 100,
          interval: 20,
          axisLabel: {
            formatter: '{value} °C'
          }
        }, {
          type: 'value',
          name: '湿度',
          min: 0,
          max: 100,
          interval: 10,
          axisLabel: {
            formatter: '{value} %'
          }
        }],
        series: this.data
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="scss" scoped>

</style>
