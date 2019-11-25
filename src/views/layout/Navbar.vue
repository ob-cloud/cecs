<template>
  <section>
    <ura-brand></ura-brand>
    <nav class="navbar navbar-static-top is-dialog">
      <div class="navbar-custom-menu">
        <!-- <ura-sys-menu class="sys-menu-nav"></ura-sys-menu> -->
        <el-dropdown trigger="click" class="uv-user-menu" @command="handleCommand">
          <el-button class="uv-menu-btn">
            <div class="user uv-user-menu">
              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                <img v-if="avatar" :src="avatar" class="user-image" alt="User Image">
                <span class="hidden-xs">{{name}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </a>
            </div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="resetPassword">{{$t('system.resetpwd')}}</el-dropdown-item>
            <el-dropdown-item command="logout">{{$t('system.logout')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <ura-nav-menu class="navbar-menu-nav"></ura-nav-menu>

      <el-dialog :title="$t('system.reset', {FIELD: 'title'})" width="600px" :visible.sync="passwordModelVisible" :close-on-click-modal="false">
        <el-form autoComplete="on" :rules="passwordModelRules" :model="passwordModel"  ref="passwordRef" label-position="right" label-width="18%">
          <el-form-item :label="$t('system.reset', {FIELD: 'oldpwd'})+':'" prop="oldPassword">
            <el-input class="filter-item" :placeholder="$t('system.reset', {FIELD: 'oldpwd'})" v-model="passwordModel.oldPassword" type="password">
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('system.reset', {FIELD: 'newpwd'})+':'" prop="newPassword">
            <el-input class="filter-item" :placeholder="$t('system.reset', {FIELD: 'newpwd'})" v-model="passwordModel.newPassword" type="password">
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('system.reset', {FIELD: 'confirm'})+':'" prop="rePassword">
            <el-input class="filter-item" :placeholder="$t('system.reset', {FIELD: 'confirm'})" v-model="passwordModel.rePassword" type="password">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-center" >
          <el-button @click="passwordModelVisible = false">{{$t('message.cancel')}}</el-button>
          <el-button type="primary" :loading="loading" @click="doresetPassword()">{{$t('message.confirm')}}</el-button>
        </div>
      </el-dialog>
    </nav>
  </section>
</template>

<script>
import UraBrand from '@/views/layout/Brand.vue'
import UraNavMenu from '@/views/layout/NavMenu.vue'
import { mapGetters } from 'vuex'
import SystemAPI from '@/api/system'
import md5 from 'md5'
export default {
  data () {
    const that = this
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error(that.$t('system.rules', {FIELD: 'length'})))
      } else if (!this.isOldPwdCorrect(md5(btoa(value) + value))) {
        callback(new Error(that.$t('system.rules', {FIELD: 'erroldpwd'})))
      } else {
        callback()
      }
    }
    const validateNewPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(that.$t('system.rules', {FIELD: 'empty'})))
      } else if (value.length < 6) {
        callback(new Error(that.$t('system.rules', {FIELD: 'length'})))
      } else {
        callback()
      }
    }
    const validateConfirm = (rule, value, callback) => {
      if (!value) {
        callback(new Error(that.$t('system.rules', {FIELD: 'empty'})))
      } else if (value.trim() !== this.passwordModel.newPassword.trim()) {
        callback(new Error(that.$t('system.rules', {FIELD: 'errconfirm'})))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      passwordModelVisible: false,
      passwordModel: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      passwordModelRules: {
        oldPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validateNewPassword }],
        rePassword: [{ required: true, trigger: 'blur', validator: validateConfirm }]
      }
    }
  },
  components: { UraBrand, UraNavMenu },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'pwd'
    ])
  },
  watch: {
    passwordModelVisible (visbile) {
      if (visbile === false) {
        this.$refs.passwordRef.resetFields()
      }
    }
  },
  methods: {
    handleCommand (command) {
      command === 'logout' && this.logout()
      command === 'resetPassword' && this.handlePassword()
    },
    switchSidebarCollapse () {
      this.$store.dispatch('switchSidebarCollapse', !this.sidebarCollapse)
    },
    logout () {
      this.$store.dispatch('logOut').then(() => {
        location.reload()
      })
    },
    handlePassword () {
      this.passwordModelVisible = true
    },
    doresetPassword () {
      this.$refs.passwordRef.validate(valid => {
        if (valid) {
          this.loading = true
          const oldPwd = this.encrypt(this.passwordModel.oldPassword)
          const confirmPwd = this.encrypt(this.passwordModel.newPassword)
          const newPwd = this.encrypt(this.passwordModel.rePassword)
          SystemAPI.resetPassword({oldPwd, newPwd, confirmPwd}).then(response => {
            this.loading = false
            if (response.status === 0 || response.message.includes('success')) {
              this.$message({
                type: 'success',
                message: this.$t('system.reset', {FIELD: 'resetsuccess'})
              })
              setTimeout(() => {
                this.passwordModelVisible = false
                this.logout()
              }, 1500)
            } else if (response.status === 700 || response.status === 800) {
              this.$message({
                type: 'error',
                message: response.message || ''
              })
            } else {
              this.$message({
                type: 'error',
                message: this.$t('system.reset', {FIELD: 'fail'})
              })
            }
          }).catch(err => {
            this.loading = false
            this.$message({
              type: 'error',
              message: this.$t('message.exception')
            })
          })
        }
      })
    },
    encrypt (text) {
      return md5(btoa(text) + text)
    },
    isOldPwdCorrect (pwd) {
      return this.pwd === pwd
    }
  }
}
</script>
