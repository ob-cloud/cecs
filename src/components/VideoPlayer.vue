<template>
  <div>
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default: () => {}
    },
    pause: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      player: null
    }
  },
  mounted () {
    this.player = videojs(this.$refs.videoPlayer, this.options, () => {
      console.log('onPlayerReady', this)
    })
  },
  watch: {
    pause (val) {
      if (val && this.player) {
        this.player.pause()
        console.log('pause video')
      }
    }
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
      console.log('destroy ')
    }
  }
}
</script>
<style lang="css">
  .video-js{
    width: 100%;
  }
</style>
