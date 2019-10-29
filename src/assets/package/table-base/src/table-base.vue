/**
* Created by skz on 2018/3/6 10:40
*/

<script>
import ElTablePlus from '../../table/'
export default {
  name: 'TableBase',
  data () {
    return {
      tooltip: {
        effect: 'light',
        content: '更多操作',
        placement: 'top'
      },
      namespace: 'el-table-plus-toolbox',
      toolboxItemNamespace: 'el-table-plus-toolbox__item',
      dropdownNamespace: 'el-table-plus-toolbox_dropdown'
    }
  },
  props: {
    fetchDataAsync: Function,
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageNo: {
      type: Number,
      default: 1
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50]
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    paginationAlign: {
      type: String,
      default: 'right',
      validator: value => ['left', 'right', 'center'].includes(value)
    },
    toolboxSize: {
      type: Number,
      default: 3
    }
  },
  methods: {
    toString (obj) {
      return Object.prototype.toString.call(obj)
    },
    isBoolean (bool) {
      return this.toString(bool) === '[object Boolean]'
    },
    isObject (obj) {
      return this.toString(obj) === '[object Object]'
    },
    isEmptyObject (obj) {
      return this.isObject(obj) && Object.keys(obj).length === 0
    },
    useTooltip (tooltip) {
      if (this.isBoolean(tooltip) && tooltip) {
        return this.tooltip
      } else if (!this.isBoolean(tooltip) && !this.isEmptyObject(tooltip)) {
        return Object.assign({}, this.tooltip, tooltip)
      }
    },
    getTablePlusInstance () {
      return this.$children[0]
    },
    getRenderDropdownItem (node) {
      return (<el-dropdown-item>{node}</el-dropdown-item>)
    },
    getRenderDropdownLink (columnTooltip) {
      const tooltip = this.useTooltip(columnTooltip)
      if (tooltip) {
        return (
          <el-tooltip effect={tooltip.effect} content={tooltip.content} placement={tooltip.placement}>
            <el-button class={'el-dropdown-link ' + this.toolboxItemNamespace} type="" icon="el-icon-more"></el-button>
          </el-tooltip>
        )
      }
      return (<el-button class={'el-dropdown-link ' + this.toolboxItemNamespace} title="更多" icon="el-icon-more"></el-button>)
    },
    getRenderDropdown (dropdownLink, dropdownItem) {
      return (
        <el-dropdown class={this.dropdownNamespace} trigger="click" placement="bottom-start">
          {dropdownLink}
          <el-dropdown-menu slot="dropdown">
            {dropdownItem}
          </el-dropdown-menu>
        </el-dropdown>
      )
    },
    generateToolboxRender (classes, nodes) {
      const clazz = []
      clazz.push(this.namespace)
      typeof classes === 'string' && clazz.push(classes || '')
      return (
        <div class={clazz.join(' ')}>{nodes}</div>
      )
    }
  },
  components: {ElTablePlus},
  render (h) {
    this.columns.map(column => {
      const { renderToolBox } = column
      if (renderToolBox) {
        column.renderBody = (h1, row) => {
          const templates = renderToolBox(h1, row)
          if (!templates || !templates.length) {
            throw new Error('renderToolBox should return an Array')
          }
          let classAppend = this.toolboxItemNamespace
          // add Custom Class to vNodes
          templates.forEach(item => {
            if (!item.data) {
              throw new Error('the item of renderToolBox return is not a vNodes')
            }
            if (item.data.class) {
              classAppend = !item.data.class.includes(this.toolboxItemNamespace) ? (item.data.class + ' ' + this.toolboxItemNamespace) : ''
            }
            item.data.class = classAppend
          })
          let vNodeShow = templates
          let vNodeHide
          if (templates.length > this.toolboxSize) {
            vNodeShow = templates.slice(0, this.toolboxSize)
            vNodeHide = templates.slice(this.toolboxSize)
            // get dropdown item's vNodes
            const dropdownItem = vNodeHide.map(node => this.getRenderDropdownItem(node))
            // get dropdown link's vNodes
            const dropdownLink = this.getRenderDropdownLink(column.tooltip)
            // get dropdown's vNodes
            const dropdowns = this.getRenderDropdown(dropdownLink, dropdownItem)
            vNodeShow.push(dropdowns)
          }
          return this.generateToolboxRender(column.clazz, vNodeShow)
        }
        delete column.renderToolBox
      }
    })
    return h('ElTablePlus', {...{ props: Object.assign({}, this.$props, this.$attrs), attrs: this.$attrs, on: this.$listeners }}, {caption: this.$slots.caption, actionBar: this.$slots.actionBar})
  }
}
</script>
