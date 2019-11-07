<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <span class="el-dropdown-link">
      {{language}}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh-CN'" command="zh-CN">
        中文-简体
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='zh-TW'" command="zh-TW">
        中文-繁體
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language () {
      return this.$store.getters.lang
    }
  },
  methods: {
    handleSetLanguage (lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLang', lang)
    }
  }
}
</script>
