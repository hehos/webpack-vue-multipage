var exec = require('child_process').exec;
var cmdStr = 'cp -rf node_modules/webpack-multipage-cfg/build/ node_modules/webpack-multipage-cfg/config/ .';
exec(cmdStr, function (err, stdout, stderr) {
  if (err) {
    console.log('发生了错误：' + stderr);
  } else {
    console.log('配置文件更新成功！')
  }
});