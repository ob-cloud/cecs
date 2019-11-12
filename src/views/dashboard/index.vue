<template>
  <div>
  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'navbarMenus'
    ]),
  },
  created () {
    this.$router.push({path: this.navbarMenus[0].path})
  }
}
</script>

<style scoped>

</style>
