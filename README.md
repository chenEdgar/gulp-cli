# 使用gulp开发构建

## 使用
`npm install` 或者 `cnpm install` 安装项目依赖文件

gulp server:dev 开启服务
gulp build:dev 测试打包
gulp build:build 发布打包

release版的资源在static目录

## 功能：
- 热重载
- js，css 合并压缩
- release版自动替换静态资源路径（css和js）
- md5 签名

## 文件介绍
- 使用zepto.js库，模板引擎使用artTemplate
- 封装了layer.mobile.js的调用
- 封装了dropload.js分页插件的调用
- 封装了ajaxget请求

API统一封装在MI 命名空间下，调用形式参考：
MI.alert('封装调用layer.open()')，其它API参见`src/index.js`

# 未实现
- 小图片转base64
- eslint检查

# 注意事项
使用了gulp-rev 和 gulp-rev-collector 实现md5版本管理
默认情况下，hash被加载文件名和后缀之间，如
```
"/css/style.css" => "/dist/css/style-1d87bebe.css" 
```
而我们的需求是
```
"/css/style.css" => "/dist/css/style.css?1d87bebe" 
```
所以对gulp-rev 和gulp-rev-collector做了改动
[原文看这里](http://www.cnblogs.com/givebest/p/4707432.html)

**改动如下**
- 打开`node_modules\gulp-rev\index.js`
```
第44行 manifest[originalFile] = revisionedFile;
更新为: manifest[originalFile] = originalFile + '?v=' + file.revHash;
```

- 打开`node_modules\gulp-rev\node_modules\rev-path\index.js`
```
10行 return filename + '-' + hash + ext;
更新为: return filename + ext;
```

- 打开`node_modules\gulp-rev-collector\index.js`
```
31行 if ( path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !== path.basename(key) ) {
更新为: if ( path.basename(json[key]).split('?')[0] !== path.basename(key) ) {
```