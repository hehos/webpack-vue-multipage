var path = require('path');
var glob = require('glob');
var SpritesmithPlugin = require('webpack-spritesmith'); // 处理雪碧图
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
 * 批量获取 { 文件名：文件路径 }对应关系
 *
 * @param cwd       要搜索的当前工作目录
 * @param fileType  要搜索的文件类型
 * @param ignore    排除的目录
 * @returns {{}}
 *
 *  * 生成 entries 和 templates下 { 文件名：文件路径 }
 *
 * 文件名生成规则：
 * 1，一级文件，对应关系为：{ 文件名：路径 }
 * 2，子目录下的文件
 *  2.1，普通文件，对应关系为：{目录名/文件名：路径}或者{目录名/目录名(n)/文件名：路径}
 *  2.2，为公共文件时，对应关系为：{ 目录名：路径 }或者{目录名/目录名(n)：路径}
 *
 */
function getFiles(cwd, fileType, ignore) {
  // 获取符合条件的文件相对路径
  var files = glob.sync(`**/*.${fileType}`, {
      cwd: cwd,
      ignore: [`${ignore}/*.${fileType}`, `**/${ignore}/*.${fileType}`]
    }),
    filesJson = {};

  console.log(files);
  files.forEach(function(filepath) {

    var name = '';

    var nameAry =
      filepath.substring(0, filepath.search(/\.(\w)+/))
        .split('/');
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

    filesJson[name] = `${cwd}/${filepath}`;;
  });

  console.log(filesJson);
  return filesJson;
}

// 批量获取多入口文件
exports.getEntries = function () {
  return getFiles(config.entryPath, 'js', config.ignore);
}

// 批量生产 html-plugin 配置
exports.htmlPlugins = function () {
  var tplObj = getFiles(config.tplPath, 'ejs', config.ignore);
  var entries = getFiles(config.entryPath, 'js', config.ignore);
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

    // 每个模板生成一个 HtmlWebpackPlugin插件配置
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

// 处理雪碧图插件
exports.spritePlugin = function () {
  var myicons = glob.sync('src/img/myicon/*');
  if(myicons.length !==0) {
    return new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, '../src/img/myicon'),
        glob: '*.png'
      },
      target: {
        image: path.resolve(__dirname, '../src/img/sprite.png'),
        // css: path.resolve(__dirname, 'src/assets/sprite.css')
        css: [[
          path.resolve(__dirname, '../src/scss/_block/_sprite.scss'),
          { format: 'custom_template' }
        ]]
      },
      apiOptions: {
        cssImageRef: '../img/sprite.png'
      },
      spritesmithOptions: {
        algorithm: 'binary-tree'
      },
      customTemplates: {
        'custom_template': function (data) {
          var shared = [
            '[class^="myicon-"], [class*=" myicon-"] {',
            // '  display: inline-block;',
            // '  vertical-align: middle;',
            '  background-image: url(I);',
            '}'].join("")
            .replace('I', data.sprites[0].image);

          var perSprite = data.sprites.map(function (sprite) {
            return '.myicon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
              .replace('N', sprite.name)
              .replace('W', sprite.width)
              .replace('H', sprite.height)
              .replace('X', sprite.offset_x)
              .replace('Y', sprite.offset_y);
          }).join('\n');

          return shared + '\n' + perSprite;
        }
      }
    });
  } else {
    return [];
  }
}