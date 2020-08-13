<template>
  <div class="slide-page">
    <transition :name="slideFade" v-if="pageVisible">
      <div class="sidebar" :style="sidebarStyle">
        <div class="header">
          <i class="el-icon el-icon-close" @click="pageVisible = false" title="关闭"></i>
          <div class="title">{{title}}{{extraLabel && `(${extraLabel})`}}</div>
        </div>
        <div class="content">
          <slot></slot>
        </div>
        <div class="footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
    <div class="cover" v-if="pageVisible"></div>
  </div>
</template>

<script>
export default {
  props: {
    dir: {
      type: String,
      default: 'horizontal'
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示框'
    },
    extraLabel: {
      type: String,
      default: ''
    }
  },
  computed: {
    slideFade () {
      return this.dir === 'horizontal' ? 'slide-fade' : 'slide-fade-v'
    },
    isHorizontal () {
      return this.dir === 'horizontal'
    },
    sidebarStyle () {
      return this.isHorizontal ? {
        right: 0,
        left: 0,
        height: 500 + 'px'
      } : {
        right: 0,
        height: '100%',
        width: 500 + 'px'
      }
    }
  },
  data () {
    return {
      pageVisible: this.visible
    }
  },
  watch: {
    visible (val) {
      this.pageVisible = val
    },
    pageVisible (val) {
      if (val === false) {
        this.$emit('onClose', val)
        this.$emit('update:visible', val)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.cover{
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}
.footer{
  position: absolute;
  bottom: 14px;
  width: 100%;
  text-align: right;
  right: 10px;
}
.sidebar{
  display: inline-block;
  position: fixed;
  bottom: 0;
  background: #fff;

  box-shadow: 0 0 2px 1px #ddd;
  z-index: 2;
  .header{
    padding: 12px 10px;
    border-bottom: 1px solid #eee;
    text-align: right;
    .title{
      padding-left: 20px;
      padding-right: 20px;
      float: left;
      color: #999;
    }
    i{
      cursor: pointer;
    }
  }
  .content{
    padding: 10px;
    .item{
      border-bottom: 1px solid #eee;
      box-shadow: 0 1px 1px 0p #f2f2f2;
      padding-bottom: 10px;
    }
    .title{
      margin-top: 10px;
      padding: 10px 12px;
      background-color: #eee;
      color: #666;
      font-size: 14px;
    }
    .detail{
      padding: 10px;
      .sensors{
        display: inline-block;
        width: 50%;
        text-align: center;
      }
    }
    .sensors p{
      padding: 20px;
      color: #666;
      span{
        font-size: 12px;
      }
      i{
        font-size: 30px;
        color: rgba(5, 100, 184, 0.9);
      }
    }
    .power{
      padding: 10px;
      text-align: center;
    }
    .action{
      padding: 10px;
    }
  }
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(500px);
  // opacity: 0;
}
.slide-fade-v-enter-active {
  transition: all .3s ease;
}
.slide-fade-v-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-v-enter, .slide-fade-v-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(500px);
  // opacity: 0;
}
</style>
