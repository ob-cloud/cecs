<template>
  <div class="panel">
    <div class="panel-header">
      <slot name="header"></slot>
    </div>
    <div class="panel-content">
      <i class="el-icon-s-opportunity" :style="[iconSize, colorStyle]"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IotPanel',
  props: {
    size: {
      type: String,
      default: 'large'
    },
    color: {
      type: String,
      default: '#fff'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    iconSize () {
      const map = {
        'large': 100,
        'medium': 60,
        'small': 30,
        'mini': 20
      }
      return {
        'fontSize': (map[this.size] || 20) + 'px'
      }
    },
    colorStyle () {
      return {
        'color': this.color
      }
    }
  },
  methods: {

  },
}
</script>

<style lang="scss">
.panel-content{
  // padding: 40px;
  text-align: center;

  > i{
    display: block;
    padding: 40px;
    color: #fff;
    // color: #f5ff07;
    transition: all .3s;
  }
}
</style>
