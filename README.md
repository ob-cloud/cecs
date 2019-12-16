# cecs

> Campus Energy Control System
> 校园节能监控系统

## 系统配置

- `src\common\config.js`

```js
const config = {
  dev: {
    baseApi: 'http://localhost:8080/',
  },
  prod: {
    baseApi: 'https://aliiot.on-bright.com'
  }
}
```

`dev.baseApi` - 开发时访问基础路径

`prod.baseApi` = 发布时，生产环境域名

- `vue.config.js`

```js
devServer: {
    proxy: {
      '/oauth': {
        target: 'https://aliiot.on-bright.com',
        ws: true,
        changeOrigin: true
      },
      '/consumer': {
        target: 'https://aliiot.on-bright.com',
        ws: true,
        changeOrigin: true
      }
    }
  },
```

接口代理配置

`target` - 目标服务路径

## Project setup

```js
yarn install
```

### Compiles and hot-reloads for development

```js
yarn run serve
```

### Compiles and minifies for production

```js
yarn run build
```
