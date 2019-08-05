<template>
    <a href="javascript:;" @click="click" class="sidebar-toggle" :class="{'is-active':isActive}" role="button">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
    </a>
</template>

<script>
export default {
  name: 'toggle',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    click: {
      type: Function,
      default: null
    }
  }
}
</script>

