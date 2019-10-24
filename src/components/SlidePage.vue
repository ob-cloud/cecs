<template>
  <div class="slide-page">
    <transition name="slide-fade" v-if="pageVisible">
      <div class="sidebar">
        <div class="header">
          <i class="el-icon el-icon-close" @click="pageVisible = false" title="关闭"></i>
          <div class="title">{{title}}</div>
        </div>
        <div class="content">
          <slot></slot>
        </div>
      </div>

    </transition>
    <div class="cover" v-if="pageVisible"></div>
  </div>
  <!-- <transition name="slide-fade" v-if="pageVisible">
    <div class="sidebar">
      <div class="header">
        <i class="el-icon el-icon-close" @click="pageVisible = false" title="关闭"></i>
        <div class="title">rrr</div>
      </div>
      <div class="content">
      </div>
    </div>

  </transition> -->
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示框'
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
.sidebar{
  display: inline-block;
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  background: #fff;
  height: 500px;
  box-shadow: 0 0 2px 1px #ddd;
  z-index: 999999;
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
</style>
