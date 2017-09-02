# webpack-vue-multipage

> 测试webpack多页应用

## 快速使用

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# 访问
http://192.168.0.188:3000/a.html#/module-a/page1
```

## 如何实现的多页应用
> 核心原理：使用vue webpack模板 + HtmlWebpackPlugin插件，
配置多个入口文件和多个模板文件。

### 实现步骤

首先使用vue webpack模板https://github.com/vuejs-templates/webpack

然后有 entries目录（入口） 和 templates目录（模板）

然后配置几个全局变量：entryPath，tplPath，ignore，commFileName（config/index.js文件中）
> * entryPath：入口文件目录
> * tplPath：模板文件目录
> * ignore：入口目录和模板目录中要排除的目录（如存放可复用模块的目录）
> * commFileName：公共文件名（如comm）

使用nodejs批量生成入口文件配置 
> 生成配置文件规则：
> * 1，entries目录下的一级文件；对应关系为：{ 文件名：路径 }
> * 2，entries目录下子目录中的文件
> *  2.1，普通文件，对应关系为：{子目录名/文件名：路径}或者{子目录名/子目录名(n个)/文件名：路径}
> *  2.2，为公共文件名或子目录同名时，对应关系为：{ 子目录名：路径 }或者{子目录名/子目录名(n个)/文件名：路径}

使用nodejs批量生成模板文件配置 
> 生成配置文件规则：同上（但是模板文件名不应该为：公共文件名或子目录同名）

使用nodejs批量生成HtmlWebpackPlugin插件配置
> * 每个模板生成一个 HtmlWebpackPlugin插件配置，
> * 允许多个模板文件对应同一入口文件（如goods目录下的list，detail模板对应一个名为goods的入口文件）
> * 并自动将打包后的js，css插入最后生成html文件中


## 如何使用

创建入口文件（entries目录）和模板文件（templates）
> 入口文件与模板文件对应关系： 
> * 一一对应：一个入口文件一个模板文件。
> * 一对多：一个入口文件对应多个模板文件。

配置相关全局变量
> 变量值可以自定义
```
# config/index.js 中配置如下变量

# 入口文件目录
entryPath: path.resolve(__dirname, '../src/entries')

# 模板文件目录
tplPath: path.resolve(__dirname, '../src/templates')

# 入口目录和模板目录中要排除的目录
ignore: '_block'

# 入口目录和模板目录的公共文件的文件名
commFileName: 'comm'
```

创建vue单文件目录
> * 存放vue单文件组件，局部使用单页应用
> * 也可以加入vue-router，vuex等
> * 局部单页应用同存vue单页应用相同