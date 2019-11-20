<template lang="html">
  <div class="cron" :val="value_">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('system.cron', {FIELD: 'year'})" name="year">
        <year v-model="yearVal" :lable="$t('system.cron', {FIELD: 'year'})"></year>
      </el-tab-pane>
      <el-tab-pane :label="$t('system.cron', {FIELD: 'week'})" name="week">
        <week v-model="weekVal" :lable="$t('system.cron', {FIELD: 'week'})"></week>
      </el-tab-pane>
      <el-tab-pane :label="$t('system.cron', {FIELD: 'month'})" name="month">
        <month v-model="monthVal" :lable="$t('system.cron', {FIELD: 'month'})"></month>
      </el-tab-pane>
      <el-tab-pane :label="$t('system.cron', {FIELD: 'day'})" name="d">
        <day v-model="dVal" :lable="$t('system.cron', {FIELD: 'day'})"></day>
      </el-tab-pane>
      <el-tab-pane :label="$t('system.cron', {FIELD: 'hour'})" name="h">
        <hour v-model="hVal" :lable="$t('system.cron', {FIELD: 'hour'})"></hour>
      </el-tab-pane>
      <el-tab-pane :label="$t('system.cron', {FIELD: 'minute'})" name="m">
        <second-and-minute v-model="mVal" :lable="$t('system.cron', {FIELD: 'minute'})"></second-and-minute >
      </el-tab-pane>
      <el-tab-pane :label="$t('system.cron', {FIELD: 'second'})" name="s">
        <second-and-minute v-model="sVal" :lable="$t('system.cron', {FIELD: 'second'})"></second-and-minute >
      </el-tab-pane>
    </el-tabs>
    <!-- table -->
    <el-table
       :data="tableData"
       size="mini"
       style="width: 100%; margin-top: 20px;">
       <el-table-column
         prop="yearVal"
         align="center"
         :label="$t('system.cron', {FIELD: 'year'})">
       </el-table-column>
       <el-table-column
         prop="weekVal"
         align="center"
         :label="$t('system.cron', {FIELD: 'week'})">
       </el-table-column>
       <el-table-column
         prop="monthVal"
         align="center"
         :label="$t('system.cron', {FIELD: 'month'})">
       </el-table-column>
       <el-table-column
         prop="dVal"
         align="center"
         :label="$t('system.cron', {FIELD: 'day'})">
       </el-table-column>
       <el-table-column
         prop="hVal"
         align="center"
         :label="$t('system.cron', {FIELD: 'hour'})">
       </el-table-column>
       <el-table-column
         prop="mVal"
         align="center"
         :label="$t('system.cron', {FIELD: 'minute'})">
       </el-table-column>
       <el-table-column
         prop="sVal"
         align="center"
         :label="$t('system.cron', {FIELD: 'second'})">
       </el-table-column>
     </el-table>
  </div>
</template>

<script>
import SecondAndMinute from './components/secondAndMinute'
import hour from './components/hour'
import day from './components/day'
import month from './components/month'
import week from './components/week'
import year from './components/year'
export default {
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      //
      activeName: 'year',
      sVal: '',
      mVal: '',
      hVal: '',
      dVal: '',
      monthVal: '',
      weekVal: '',
      yearVal: ''
    }
  },
  watch: {
    'value' (a, b) {
      this.updateVal()
    }
  },
  computed: {
    tableData () {
      return [{
        sVal: this.sVal,
        mVal: this.mVal,
        hVal: this.hVal,
        dVal: this.dVal,
        monthVal: this.monthVal,
        weekVal: this.weekVal,
        yearVal: this.yearVal
      }]
    },
    value_ () {
      if (!this.dVal && !this.weekVal) {
        return ''
      }
      if (this.dVal === '?' && this.weekVal === '?') {
        this.$message.error({title: false, message: this.$t('system.cron', {FIELD: 'dateWeekPointAt'})})
      }
      if (this.dVal !== '?' && this.weekVal !== '?') {
        this.$message.error({title: false, message: this.$t('system.cron', {FIELD: 'dateWeekNoPointAt'})})
      }
      const v = `${this.sVal} ${this.mVal} ${this.hVal} ${this.dVal} ${this.monthVal} ${this.weekVal} ${this.yearVal}`
      if (v !== this.value) {
        this.$emit('input', v)
      }
      return v
    }
  },
  methods: {
    updateVal () {
      if (!this.value) {
        return
      }
      const arrays = this.value.split(' ')
      this.sVal = arrays[0]
      this.mVal = arrays[1]
      this.hVal = arrays[2]
      this.dVal = arrays[3]
      this.monthVal = arrays[4]
      this.weekVal = arrays[5]
      this.yearVal = arrays[6]
    }
  },
  created () {
    this.updateVal()
  },
  components: {
    SecondAndMinute, hour, day, month, week, year
  }
}
</script>

<style lang="css">
.cron {
  text-align: left;
  padding: 10px;
  line-height: 40px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}
</style>
