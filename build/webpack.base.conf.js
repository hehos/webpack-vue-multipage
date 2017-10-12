var path = require('path')
var glob = require('glob');
var webpack = require('webpack')
var utils = require('./utils')
var SpritesmithPlugin = require('webpack-spritesmith'); // 处理雪碧图
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: utils.getEntries(),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      // 'jq': resolve('') + '/static/vendors/jquery-3.2.1.min.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      { //解析 .ejs
        test: /\.ejs$/,
        loader: 'ejs-loader',
        options: {
          variable: 'data'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    // webpack 环境全局变量，这里 $ 是全局的，不需要 require('jquery')
    new webpack.ProvidePlugin({
      // $: "jq"
    }),

    // 处理雪碧图插件
    ...(utils.spritePlugin())
  ],
  // 浏览器环境的全局变量
  // 防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖
  // 详情：https://doc.webpack-china.org/configuration/externals/
  externals: {
    // $: "window.jquery"
  },
}
