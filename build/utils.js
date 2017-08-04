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

/**
 *
 * 批量获取 { 文件名：文件路径 }
 *
 * @param filePath
 * @returns {}
 *
 * 生成 entries 和 templates下 { 文件名：文件路径 }
 *
 * 文件名生成规则：
 * 1，一级文件 =》 { 文件名：路径 }
 * 2，子目录下的文件
 *  2.1，文件名为index或子目录名 { 目录名：路径 }
 *  2.2，非index文件名 { 目录名 + 文件名：路径 }
 *
 */
function getFiles(filePath) {
  var files = glob.sync(filePath),
    filesJson = {};

  files.forEach(function(filepath) {

    var name = '';

    // 截取起始位置'src/' 后第一个字符下标，结束位置'.*'起始位置下标的字符串。
    var nameAry =
      filepath.substring(filepath.search('src/') + 4,
        filepath.search(/\.(\w)+/))
        .split('/');
    nameAry = nameAry.slice(1); // 去掉第一个元素（'entries'或'templates'字符串）
    let len = nameAry.length;

    if(len !== 1
      && (nameAry[len-1] === nameAry[len-2]
      || nameAry[len-1] === config.commFileName)) {
      nameAry.pop();
    }
    nameAry.forEach(function (path) {
      name += path + '/';
    });
    name = name.substring(0, name.length - 1);

    filesJson[name] = filepath;
  });

  return filesJson;
}

// 批量获取多入口文件
exports.getEntries = function () {
  console.log(getFiles(config.entryPath));
  return getFiles(config.entryPath);
}

// 批量生产 html-plugin 配置
exports.htmlPlugins = function () {
  var tplObj = getFiles(config.tplPath);
  var entries = getFiles(config.entryPath);
  console.log(tplObj);
  var plugins = [];
  Object.keys(tplObj).forEach(function(name) {
    var chunks = [];
    if(process.env.NODE_ENV === 'production') {
      chunks = chunks.concat(['vendor', 'manifest']);
    }
    chunks.push(config.commFileName);
    // 允许多个模板文件对应同一入口文件
    Object.keys(entries).forEach(function (name2) {
      if(name.includes(name2) && name2 !== name) {
        chunks.push(name2);
      }
    })
    Object.keys(entries).forEach(function (name2) {
      if(name2 === name) {
        chunks.push(name2);
      }
    })

    console.log(name + ':')
    console.log(chunks);

    // 每个页面生成一个html
    var plugin = new HtmlWebpackPlugin({
      // 生成出来的html文件名
      filename: name + '.html',
      // 每个html的模版
      template: tplObj[name],
      // 自动将引用插入html
      inject: true,
      // 每个html引用的js模块，也可以在这里加上vendor等公用模块
      // chunks: ['manifest', 'vendor', name]
      chunks: chunks,
      chunksSortMode: function (chunk1, chunk2) {
        var order = chunks;
        var order1 = order.indexOf(chunk1.names[0]);
        var order2 = order.indexOf(chunk2.names[0]);
        return order1 - order2;
      },
      // 发布模式打包
      minify: process.env.NODE_ENV === 'production'
        && config.build.htmlMinify
        ? {
          removeComments: true,
          collapseWhitespace: false,
          removeAttributeQuotes: true
        } : false
    });
    plugins.push(plugin);
  })
  return plugins;
}