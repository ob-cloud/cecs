<template>
  <div class="smart">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe border
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @current-change="onSelectionChange"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import SceneAPI from '@/api/scene'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
export default {
  name: 'room-scene-binding',
  data () {
    return {
      tableLoading: true,
      tableHeight: 500,
      search: {
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: []
    }
  },
  components: { BaseTable },
  computed: {
    total () {
      return this.tableData.length || 0
    }
  },
  mounted () {
    this.columns = this.getColumns()
    this.getSceneList()
  },
  methods: {
    getColumns () {
      return [{
        label: '选项',
        align: 'center',
        renderBody (h) {
          return (
            <el-radio value="0"></el-radio>
          )
        }
      }, {
        label: '场景名称',
        prop: 'scene_name',
        align: 'center'
      }, {
        label: '场景类型',
        prop: 'scene_type',
        align: 'center',
        formatter (val) {
          const type = {
            '00': '服务器场景',
            '01': '本地场景',
            '02': '有人场景',
            '03': '无人场景',
            '04': '安防场景'
          }
          return type[val] || '服务器场景'
        }
      }, {
        label: '消息推送',
        prop: 'msg_alter',
        align: 'center',
        formatter (val) {
          const push = {
            0: '无推送',
            1: 'APP推送',
            2: '短信推送',
            3: 'APP+短信推送'
          }
          return push[val] || '无推送'
        }
      }, {
        label: '场景状态',
        align: 'center',
        prop: 'scene_status',
        formatter (val) {
          return val === 1 ? '启用' : '关闭'
        }
      }]
    },
    getSceneList () {
      this.tableLoading = true
      SceneAPI.getSceneList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.scenes
        } else {
          this.$message({
            message: resp.message || '场景获取失败'
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: err.message || '场景获取失败',
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
      this.getSceneList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getSceneList()
    },
    onSelectionChange (selections) {
      this.$emit('selection', selections)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
