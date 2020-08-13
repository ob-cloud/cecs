<template>
  <div class="panel">
    <div class="panel-header">
      <slot name="header"></slot>
    </div>
    <div class="panel-content">
      <div class="key-container">
        <span class="key" :class="{'active': item === selectedKey}" v-for="(item, index) in keyNum" :key="index" @click="onClickKey(item)"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IotPanel',
  props: {
    type: {
      type: String,
      default: '' // scene | mixup
    },
    keyNum: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {
      selectedKey: ''
    }
  },
  methods: {
    onClickKey (selectedKey) {
      this.selectedKey = selectedKey
      this.$emit('on-panel-key-selected', selectedKey)
    }
  },
}
</script>

<style lang="scss" scoped>
.panel-content{
  padding: 10px;
  text-align: center;

  .key-container{
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #A2AAB5;
    border-radius: 6px;
  }
}

.key{
  display: inline-block;
  cursor: pointer;
  &::after{
    content: " ";
    width: 20px;
    height: 20px;
    border: 1px solid #A2AAB5;
    border-radius: 100%;
    margin: 12px 16px;
    display: inline-block;
    transition: all .3s;
  }
  &.active,
  &:hover{
    &::after {
      border-color: #0185ED;
    }
  }
}
</style>
