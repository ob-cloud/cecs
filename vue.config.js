/*
 * @Author: eamiear
 * @Date: 2018-11-27 11:32:42
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-10-18 15:01:35
 */

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: isProduction ? './' : '/',
  devServer: {
    proxy: {
      '/oauth': {
        // target: 'https://alicloud.on-bright.com',
        target: 'https://aliiot.on-bright.com',
        // target: 'https://192.168.200.155:8401',
        // target: 'http://192.168.200.101',
        // target: 'http://192.168.200.102:9999',
        ws: true,
        changeOrigin: true
      },
      '/consumer': {
        // target: 'https://alicloud.on-bright.com',
        target: 'https://aliiot.on-bright.com',
        // target: 'https://192.168.200.155:8401',
        // target: 'http://192.168.200.101',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: config => ({
    devtool: 'source-map',
    // externals: {
    //   'vue': 'Vue',
    //   'vue-router': 'VueRouter',
    //   'vuex': 'Vuex'
    // },
    resolve: {
      alias: {
        'views': '@/views'
      }
    }
  }),
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ]
}
