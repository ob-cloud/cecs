<template>
  <div class="ui-container" :style="{height: layoutHeight + 'px'}">
    <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      :pageNo="search.pageNo"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
      <slot>
        <template slot="caption">
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.wifi.search', {FIELD: 'serial'})" v-model="search.deviceId"></el-input>
          <!-- <el-input @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.wifi.search', {FIELD: 'type'})" v-model="search.device_type"></el-input> -->
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" :placeholder="$t('smart.wifi.search', {FIELD: 'name'})" v-model="search.name"></el-input>
          <el-select clearable class="caption-item" :placeholder="$t('smart.wifi.search', {FIELD: 'status'})" v-model="search.online">
            <el-option :label="$t('smart.wifi.search', {FIELD: 'status'})" value=''></el-option>
            <el-option :label="$t('message.status', {STATUS: 'online'})" :value='0'></el-option>
            <el-option :label="$t('message.status', {STATUS: 'offline'})" :value='1'></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">{{$t('message.search')}}</el-button>
        </template>
        <template slot="actionBar">
          <el-button v-isPermited="40" type="primary" @click="handleAction">{{$t('smart.group.action', {FIELD: 'create'})}}</el-button>
        </template>
      </slot>
    </base-table>
    <!-- <el-dialog top="10%" width="760px" title="设备操作历史" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <device-history :serialId="activeRecord.obox_serial_id"></device-history>
    </el-dialog> -->
    <slide-page :visible.sync="editDialogVisible" dir="vertical" title="添加编组"  extraLabel="" @onClose="acSerialId = ''">
      <el-form class="ob-form" ref="rename" autoComplete="on" :rules="formRules" :model="formModel" label-position="left" label-width="80px">
        <el-form-item label="组名" prop="group_name">
          <el-input v-model="formModel.group_name" placeholder="输入组名"></el-input>
        </el-form-item>
        <el-form-item label="组员" prop="group_member">
          <el-input v-model="formModel.group_member" placeholder="选择组员" @click.native="openDeviceBox"></el-input>
        </el-form-item>
        <el-form-item label="短地址" prop="addr">
          <el-input :readonly="!!formModel.group_id" v-model="formModel.addr" placeholder="输入短地址(2个字节)"></el-input>
        </el-form-item>
        <el-form-item label="面板地址" prop="group_addr">
          <el-input :readonly="!!formModel.group_id" v-model="formModel.group_addr" placeholder="输入面板地址(1个字节)"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddGroup()">确定</el-button>
      </span>
    </slide-page>
    <!-- <el-drawer
      title="添加编组"
      :before-close="handleClose"
      :visible.sync="editDialogVisible"
      direction="rtl"
      custom-class="demo-drawer"
      size="40%"
      ref="drawer"
      >
      <div class="drawer__content">
        <el-form class="ob-form" ref="rename" autoComplete="on" :rules="formRules" :model="formModel" label-position="left" label-width="80px">
          <el-form-item label="组名" prop="group_name">
            <el-input v-model="formModel.group_name" placeholder="输入组名"></el-input>
          </el-form-item>
          <el-form-item label="组员" prop="group_member">
            <el-input v-model="formModel.group_member" placeholder="选择组员" @click.native="dialogVisible = true"></el-input>
          </el-form-item>
          <el-form-item label="短地址" prop="addr">
            <el-input v-model="formModel.addr" placeholder="输入短地址"></el-input>
          </el-form-item>
          <el-form-item label="面板地址" prop="group_addr">
            <el-input v-model="formModel.group_addr" placeholder="输入面板地址"></el-input>
          </el-form-item>
        </el-form>
        <div class="drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer> -->

    <el-dialog  v-if="dialogVisible" top="2%" width="98%" title="设备分组" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <div class="dialog__content">
        <el-container style="height: 500px; border: 1px solid #282A39">
          <el-aside width="200px" style="background-color: #282A39">
            <ul class="list">
              <li class="list-item" :class="{'active': item.obox_serial_id === oboxSelectedKey}" v-for="(item) in oboxList" :key="item.obox_serial_id" @click="onSelectedItem(item.obox_serial_id)">{{item.obox_name}}({{item.obox_status === 1 ? '在线' : '离线'}})</li>
            </ul>
          </el-aside>

          <el-main v-loading="listLoading">
            <el-checkbox-group v-model="checkDeviceListId" class="checkbox-list">
              <el-checkbox-button class="checkbox-list-item" v-for="item in deviceList" :label="item.serialId" :key="item.serialId">
                <div>{{item.name}}</div>
                <div>{{getDeviceTypeDescriptor(item.device_type)}}</div>
                <div>{{getDeviceTypeDescriptor(item.device_type, item.device_child_type)}}</div>
              </el-checkbox-button>
            </el-checkbox-group>
          </el-main>
        </el-container>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('message.cancel')}}</el-button>
        <el-button type="primary" @click="handleCheckDevice()">{{$t('message.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import DeviceAPI from '@/api/device'
import OboxAPI from '@/api/obox'
import SlidePage from '@/components/SlidePage'
// import AcControl from './components/ac'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
const {default: Suit} = require('@/common/suit')
const {default: TypeHint} = require('@/oblink/suit')
export default {
  name: 'group',
  props: {
    height: {
      type: Number,
      default: 0
    },
    layoutHeight: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: true,
      loading: false,
      total: 0,
      search: {
        // deviceId: '',
        // name: '',
        // type: '',
        // online: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      oboxList: [],
      oboxSelectedKey: '',
      listLoading: false,
      deviceList: [],
      checkDeviceListId: [],


      dialogVisible: false,
      activeRecord: {},
      acSerialId: '',
      editDialogVisible: false, // 重命名
      formModel: {
        group_name: '',
        group_member: [],
        addr: '',
        group_addr: ''
      },
      formRules: {
        group_name: [{ required: true, message: '组名不能为空', trigger: 'blur' }],
        group_member: [{ required: true, message: '成员不能为空', trigger: 'blur' }],
        addr: [{ required: true, message: '短地址不能为空', trigger: 'blur' }],
        group_addr: [{ required: true, message: '组地址不能为空', trigger: 'blur' }],
      }
    }
  },
  components: { BaseTable, SlidePage },
  created () {
    // this.getOboxList()
    this.columns = this.getColumns()
    this.getPanelGroupList()
  },
  mounted () {
    // Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {

    getAllOboxList () {
      OboxAPI.getAllObox().then(res => {
        if (res.status === 0) {
          this.oboxList = res.data
        }
      })
    },
    openDeviceBox () {
      this.dialogVisible = true
      this.getAllOboxList()
    },
    onSelectedItem (serialId) {
      this.oboxSelectedKey = serialId
      this.checkDeviceListId = []
      this.getDeviceByOboxId()
    },
    getDeviceByOboxId () {
      this.listLoading = true
      const params = {
        obox_serial_id: this.oboxSelectedKey,
        serialId: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: 1000
      }
      DeviceAPI.getOboxDeviceList(params).then(resp => {
        if (resp.status === 0) {
          this.deviceList = resp.data.records
        } else {
          this.$message({
            message: '获取失败'
          })
        }
        this.listLoading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: '获取异常',
          type: 'error'
        })
        this.listLoading = false
      })
    },
    getDeviceTypeDescriptor (deviceType, deviceSubType) {
      return deviceSubType ? Suit.getDeviceTypeDescriptor(deviceType, deviceSubType) : Suit.getRootDeviceDescriptor(deviceType)
    },
    handleCheckDevice () {
      if (!this.checkDeviceListId.length) {
        return this.$message({
          title: '提示',
          message: '请选择设备',
          type: 'warning'
        })
      }
      this.formModel.group_member = this.checkDeviceListId.join(',')
      this.checkDeviceListId = []
      this.dialogVisible = false
    },


    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 50
    },
    getColumns () {
      return [{
        label: this.$t('smart.group.tableField', {FIELD: 'serial'}),
        prop: 'group_id',
        align: 'center'
      }, {
        label: this.$t('smart.group.tableField', {FIELD: 'name'}),
        prop: 'group_name',
        align: 'center'
      }, {
        label: this.$t('smart.group.tableField', {FIELD: 'addr'}),
        prop: 'panel_addr',
        align: 'left',
        renderBody (h, row) {
          const panelAddr = row.panel_addr
          const cell = panelAddr && panelAddr.length ? <div><p style="text-align:left;">addr: {panelAddr[0].addr}</p><p style="text-align:left;">group_addr: {panelAddr[0].group_addr}</p></div> : <span>-</span>
          return cell
        }
      }, {
        label: this.$t('smart.wifi.tableField', {FIELD: 'action'}),
        align: 'center',
        renderToolBox: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolbox = []
      const rename = <el-button size="tiny" icon="el-icon-edit" title={this.$t('message.rename')} onClick={() => this.handleAction(row)}></el-button>
      const remove = <el-button size="tiny" icon="el-icon-delete" title={this.$t('message.delete')} onClick={() => this.removeDevice(row)}></el-button>
      if (this.$isPermited(32) && TypeHint.isTransponder(row.type)) {
        toolbox.push(<el-button size="tiny" icon="obicon obicon-infrared" title={this.$t('smart.wifi.placeholder', {FIELD: 'infrated'})} onClick={() => this.handleAcControl(row)}></el-button>)
      }
      toolbox.push(rename)
      this.$isPermited(34) && toolbox.push(remove)
      !toolbox.length && toolbox.push(<span title="">-</span>)
      return toolbox
    },
    getPanelGroupList () {
      this.tableLoading = true
      // const params = {...this.search}
      const params = {
        current: this.search.pageNo,
        size: this.search.pageSize,
      }
      DeviceAPI.getPanelGroupList(params).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.list
          this.total = resp.total
          if (!this.tableData.length && this.search.pageNo !== 1) {
            this.search.pageNo = PAGINATION_PAGENO
            this.getPanelGroupList()
          }
        } else {
          this.$message({
            message: this.$t('smart.obox.message', {MESSAGE: 'fetchFail'})
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: this.$t('message.fail'),
          message: this.$t('message.exception'),
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    getOboxList () {
      DeviceAPI.getOboxList().then(res => {
        if (res.status === 200) {
          this.oboxList = res.data.oboxs
        }
      })
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
      this.getPanelGroupList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getPanelGroupList()
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.getPanelGroupList()
    },
    handleAcControl (row) {
      this.dialogVisible = true
      this.acSerialId = row.deviceId
    },
    removeDevice (row) {
      this.$confirm('确认删除编组？', '确认提示', {
        confirmButtonText: this.$t('message.confirm'),
        cancelButtonText: this.$t('message.cancel'),
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemove(row)
      }).catch(() => {
        console.log('cancel')
      })
    },
    doRemove (row) {
      const loader = this.$loading({
        text: this.$t('smart.obox.message', {MESSAGE: 'loading'})
      })
      DeviceAPI.delPanelGroup(row.group_id).then(res => {
        loader.close()
        this.responseHandler(res, '删除编组')
        if (res.message.includes('success')) {
          this.getPanelGroupList()
        }
      }).catch(() => {
        loader.close()
        this.responseHandler({message: 'error'}, '删除编组')
      })
    },
    handleClose () {
      if (this.loading) {
        // return
      }
      // this.$confirm('确定要提交表单吗？')
      //   .then(_ => {
      //     this.loading = true
      //     this.timer = setTimeout(() => {
      //       done();
      //       // 动画关闭需要一定的时间
      //       setTimeout(() => {
      //         this.loading = false;
      //       }, 400)
      //     }, 2000)
      //   })
      //   .catch(_ => {})
    },
    handleAction (row) {
      this.editDialogVisible = true
      const model = {
        group_id: row.group_id,
        group_member: row.group_member,
        group_name: row.group_name,
        addr: row.panel_addr && row.panel_addr.length ? row.panel_addr[0].addr : '',
        group_addr: row.panel_addr && row.panel_addr.length ? row.panel_addr[0].group_addr : ''
      }
      this.formModel = {...model}
    },
    handleAddGroup () {
      this.$refs.rename.validate(valid => {
        if (valid) {
          const formdata = {}
          if (this.formModel.group_id) {
            formdata.group_id = this.formModel.group_id
          }
          formdata.panel_addr = {list: [{addr: this.formModel.addr, groupAddr: this.formModel.group_addr}]}
          formdata.group_name = this.formModel.group_name
          formdata.group_member = this.formModel.group_member
          DeviceAPI.setPanelGroup(formdata).then(res => {
            this.responseHandler(res, '添加失败')
            if (res.message.includes('success')) {
              this.editDialogVisible = false
              this.getPanelGroupList()
            }
          }).catch(() => {
            this.responseHandler({message: 'error'}, '服务异常')
            this.editDialogVisible = false
          })
        }
      })
    },
    responseHandler (res, msg) {
      let message = `${msg}${this.$t('message.fail')}`
      let type = 'error'
      if (res.message.includes('success')) {
        type = 'success'
        message = `${msg}${this.$t('message.success')}`
      }
      this.$message({
        type,
        message
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  width: 94%;
  margin: 12px auto;
}
.drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%
}

.drawer__content form {
  flex: 1
}

.drawer__footer {
  display: flex
}

.drawer__footer button {
  flex: 1
}

.list{
  // padding: 5px;
}
.list-item{
  padding: 20px 16px;
  text-align: center;
  border-bottom: 1px solid #000;
  transition: all .3s;
  cursor: pointer;

  &:hover,
  &.active{
    background: #3A4257;
  }
}

</style>
<style lang="scss">
  .checkbox-list{
    .checkbox-list-item > span{
      width: 200px;
      height: 120px;
      // border: 1px solid #3A4257;
      border: none;
      border-radius: 6px;
      margin: 10px;
    }
    .checkbox-list-item div{
      &:first-child{
        padding: 10px;
      }
      padding: 5px;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner,
    .el-checkbox-button:last-child .el-checkbox-button__inner,
    .el-checkbox-button:first-child .el-checkbox-button__inner{
      border: none;
      border-radius: 6px;
    }
  }
</style>
