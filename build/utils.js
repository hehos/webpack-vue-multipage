var path = require('path');
var glob = require('glob');
var config = require('../config');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

function getFiles(filePath) {
  var files = glob.sync(filePath),
    filesJson = {};

  files.forEach(function(filepath) {
    // 取倒数第二层(view下面的文件夹)做包名
    var split = filepath.split('/');
    var name = split[split.length - 1].split('.')[0];

    filesJson[name] = filepath;
  });

  return filesJson;
}

// 批量获取多入口文件
exports.getEntries = function () {
  return getFiles(config.entryPath);;
}

// 批量生产 html-plugin 配置
exports.htmlPlugins = function () {
  var htmlPlugins = getFiles(config.tplPath);
  var plugins = [];
  Object.keys(htmlPlugins).forEach(function(name) {
    // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
    // webpackConfig.entry[name] = entries[name];

    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
      // 生成出来的html文件名
      filename: name + '.html',
      // 每个html的模版
      template: htmlPlugins[name],
      // 自动将引用插入html
      inject: true,
      // 每个html引用的js模块，也可以在这里加上vendor等公用模块
      // chunks: ['manifest', 'vendor', name]
      chunks: [name]
    });
    plugins.push(plugin);
  })
  return plugins;
}