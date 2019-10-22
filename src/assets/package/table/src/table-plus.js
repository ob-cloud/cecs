/**
 * Created by skz on 2018/3/6 10:40
 */
const PAGINATION_NO = 1
const PAGINATION_SIZE = 10
export default {
  name: 'ElTablePlus',
  componentName: 'ElTablePlus',
  props: {
    fetchDataAsync: Function,
    columns: {
      type: Array,
      default: []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: PAGINATION_SIZE
    },
    pageNo: {
      type: Number,
      default: PAGINATION_NO
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50]
    },
    pageTotal: {
      type: Number,
      default: 0
    },
    isStaticPaging: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    paginationAlign: {
      type: String,
      default: 'right',
      validator: value => ['left', 'right', 'center'].includes(value)
    }
  },
  data () {
    return {
      data: [],
      loading: false,
      isRefresh: false, // 是否重置刷新
      pageSizeProxy: this.pageSize,
      currentPage: this.pageNo,
      total: this.pageTotal
    }
  },
  computed: {
    hasPagination () {
      // return !!this.fetchDataAsync || (this.tableData && this.tableData.length >= this.pageSize)
      return this.showPagination && (!!this.fetchDataAsync || !!(this.tableData && this.tableData.length))
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    reload (pageNo = PAGINATION_NO, pageSize = PAGINATION_SIZE) {
      // this.handleCurrentChange(1)
      // this.isRefresh = true
      this.currentPage = pageNo
      this.pageSizeProxy = pageSize
      this.getData()
    },
    reloadCurrent () {
      this.getData()
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
      // if (this.isRefresh) { // 避免重复请求数据
      //   this.isRefresh = false
      // } else {
      //   this.getData()
      // }
      this.getData()
      this.$emit('on-current-page-change', currentPage)
    },
    handleSizeChange (pageSize) {
      this.pageSizeProxy = pageSize
      this.getData()
      this.$emit('on-page-size-change', pageSize)
    },
    isStaticData () {
      return this.tableData && this.tableData.length
    },
    isAsyncData () {
      return !!this.fetchDataAsync
    },
    getStaticTableData () {
      if (this.isStaticPaging) {
        const sliceIndex = this.pageSizeProxy * (this.currentPage - 1)
        const sliceTotal = sliceIndex + this.pageSizeProxy
        return {data: this.tableData.slice(sliceIndex, sliceTotal), total: this.tableData.length}
      }
      return {data: this.tableData, total: this.pageTotal}
    },
    getDataStrategy (pageNo, pageSize) {
      return this.isStaticData() ? this.getStaticTableData() : this.isAsyncData() ? this.fetchDataAsync(pageNo, pageSize) : {data: [], total: 0}
    },
    async getData () {
      this.data = []
      this.loading = true
      try {
        const { data, total } = await this.getDataStrategy(this.currentPage, this.pageSizeProxy)

        this.data = data
        this.total = total
      } catch (err) {
        console.error(err); // eslint-disable-line
        this.data = []
        this.total = 0
        this.loading = false
      }
      this.$nextTick(() => {
        this.loading = false
      })
    }
  },
  watch: {
    pageSize (pageSize) {
      this.pageSizeProxy = pageSize
    },
    pageNo (pageNo) {
      this.currentPage = pageNo
    },
    pageTotal (total) {
      this.total = total
    },
    tableData (data) {
      data && this.getData()
    }
  },
  render (h) {
    const namespace = 'el-table-plus'
    const { caption, actionBar } = Object.keys(this.$slots).length ? this.$slots : this.$parent.$slots
    return (
      <div class={namespace}>
        {
          (caption || actionBar) &&
          <div class={`${namespace}__header`}>
            <h1 class={`${namespace}__header__caption`}>{caption}</h1>
            <div class={`${namespace}__header__action-bar`}>{actionBar}</div>
          </div>
        }
        <el-table data={this.data} v-loading={this.loading}
          {...{ props: Object.assign({height: this.$attrs.height}, this.$props, this.$attrs), on: this.$listeners }}>
          {
            this.columns.map(column => {
              const { formatter, renderBody } = column
              const data = {
                props: {
                  ...column,
                  formatter: formatter && (row => formatter(row[column.prop], row))
                }
              }
              if (renderBody) {
                data.scopedSlots = {
                  default: ({ row }) => {
                    return (renderBody(h, row))
                  }
                }
                // let render
                // (async() => {
                //   render = async ({row}) => {
                //     return await renderBody(h, row)
                //   }
                // })()
                // console.log('scope render  ', render)
                // data.scopedSlots = {
                //   default: ({ row }) => {
                //     let render
                //     (async () => {
                //       render = await renderBody(h, row)
                //     })()
                //     console.log('render --- ', render)
                //     return render
                //   }
                // }
                // console.log('scopeSlots  ', data.scopedSlots)
              }
              return (
                <el-table-column {...data}></el-table-column>
              )
            })
          }
        </el-table>
        {
          this.hasPagination &&
          <el-pagination class={`el-pagination--${this.paginationAlign}`}
            current-page={this.currentPage} page-size={this.pageSizeProxy}
            total={this.total} on-current-change={this.handleCurrentChange}
            page-sizes={this.pageSizes} on-size-change={this.handleSizeChange}
            layout={this.layout}>
          </el-pagination>
        }
      </div>
    )
  }
}
