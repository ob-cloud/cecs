<template>
  <i class="fa" :class="iconClass"></i>
</template>

<script>
export default {
  name: 'icon',
  props: {
    name: {
      type: String,
      required: true
    },
    scale: {
      type: Number,
      default: 0
    },
    align: {
      type: String
    },
    border: {
      type: Boolean,
      default: false
    },
    spin: {
      type: Boolean,
      default: false
    },
    rotate: {
      type: Number
    },
    flip: {
      type: String
    }
  },
  computed: {
    iconClass () {
      const scale = this.scale ? ` fa-${this.scale}x` : ''
      const align = this.align ? ` fa-pull-${this.align}` : ''
      const border = this.border ? ` fa-border` : ''
      const spin = this.spin ? ` fa-spin` : ''
      const rotate = this.rotate ? ` fa-rotate-${this.rotate}` : ''
      return `fa-${this.name} ` + scale + align + border + spin + rotate
    }
  }
}
</script>
