<template>
  <section class="app-wrapper">
    <navbar class="app-header"></navbar>
    <article class="app-main" :style="appMainStyles">
      <router-view/>
    </article>
  </section>
</template>

<script>
import Navbar from '@/views/layout/Navbar.vue'
import {
  mapGetters
} from 'vuex'

export default {
  name: 'layout',
  components: {
    Navbar
  },
  mounted () {
    this.resetDocumentClientHeight()
    window.onresize = () => {
      this.resetDocumentClientHeight()
    }
  },
  computed: {
    ...mapGetters([
      'documentClientHeight'
    ]),
    appMainStyles () {
      let height = this.documentClientHeight
      height -= 50 // navbar
      return [{
        'minHeight': `${height}px`
      }, {
        'height': `${height}px`
      }]
    }
  },
  methods: {
    resetDocumentClientHeight () {
      this.$store.dispatch('updateDocumentClientHeight', document.documentElement.clientHeight)
    }
  }
}
</script>
