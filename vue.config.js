/*
 * @Author: eamiear
 * @Date: 2018-11-27 11:32:42
 * @Last Modified by: eamiear
 * @Last Modified time: 2019-08-20 14:19:59
 */

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: isProduction ? './' : '/',
  devServer: {
    proxy: {
      '/oauth': {
        // target: 'https://alicloud.on-bright.com',
        target: 'https://aliiot.on-bright.com',
        ws: true,
        changeOrigin: true
      },
      '/consumer': {
        // target: 'https://alicloud.on-bright.com',
        target: 'https://aliiot.on-bright.com',
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
  })
}
