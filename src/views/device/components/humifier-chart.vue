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
            type: 'none',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          data: [this.$t('smart.obox.tableField', {FIELD: 'temperature'}), this.$t('smart.obox.tableField', {FIELD: 'humidifier'})]
        },
        color: ['#8FC1FE', '#0FFF7B'],
        textStyle: {
          color: '#bcc6d0',
        },
        xAxis: [{
          type: 'category',
          data: this.xAxis,
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#A2AAB5'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          name: this.$t('smart.obox.tableField', {FIELD: 'temperature'}),
          min: 0,
          max: 100,
          interval: 20,
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#A2AAB5'
            }
          },
          axisLabel: {
            formatter: '{value} °C'
          }
        }, {
          type: 'value',
          name: this.$t('smart.obox.tableField', {FIELD: 'humidifier'}),
          min: 0,
          max: 100,
          interval: 10,
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#A2AAB5'
            }
          },
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
