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
              </a>
            </div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="resetPassword">重设密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <ura-nav-menu class="navbar-menu-nav"></ura-nav-menu>

      <el-dialog title="重设密码" width="600px" :visible.sync="passwordModelVisible" :close-on-click-modal="false">
        <el-form autoComplete="on" :rules="passwordModelRules" :model="passwordModel"  ref="passwordRef" label-position="right" label-width="18%">
          <el-form-item label="旧密码:" prop="oldPassword">
            <el-input class="filter-item" placeholder="旧密码" v-model="passwordModel.oldPassword" type="password">
            </el-input>
          </el-form-item>
          <el-form-item label="新密码:" prop="newPassword">
            <el-input class="filter-item" placeholder="新密码" v-model="passwordModel.newPassword" type="password">
            </el-input>
          </el-form-item>
          <el-form-item label="确认新密码:" prop="rePassword">
            <el-input class="filter-item" placeholder="确认新密码" v-model="passwordModel.rePassword" type="password">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-center" >
          <el-button @click="passwordModelVisible = false">取 消</el-button>
          <el-button type="primary" @click="doresetPassword()">确 认</el-button>
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
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else if (!this.isOldPwdCorrect(md5(btoa(value) + value))) {
        callback(new Error('旧密码不正确'))
      } else {
        callback()
      }
    }
    const validateConfirm = (rule, value, callback) => {
      if (!value) {
        callback(new Error('密码不能为空'))
      } else if (value.trim() !== this.passwordModel.newPassword.trim()) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      passwordModelVisible: false,
      passwordModel: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      },
      passwordModelRules: {
        oldPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
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
          let pwd = this.passwordModel.rePassword
          pwd = md5(btoa(pwd) + pwd)
          SystemAPI.resetPassword(pwd).then(response => {
            if (response.message.includes('update success')) {
              this.$message({
                type: 'success',
                message: '重置成功， 准备退出重新登录'
              })
              setTimeout(() => {
                this.passwordModelVisible = false
                this.logout()
              }, 1000)
            } else {
              this.$message({
                type: 'error',
                message: response.msg || '重置失败'
              })
            }
          })
        }
      })
    },
    isOldPwdCorrect (pwd) {
      return this.pwd === pwd
    }
  }
}
</script>
