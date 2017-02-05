# 使用gulp开发构建

## 使用
`npm install` 或者 `cnpm install` 安装项目依赖文件

gulp server:dev 开启服务
gulp build:dev 测试打包
gulp build:build 发布打包

## 功能：
- 热重载
- js，css 合并压缩

## 文件介绍
- 使用zepto.js库，模板引擎使用artTemplate
- 封装了layer.mobile.js的调用
- 封装了dropload.js分页插件的调用
- 封装了ajaxget请求

API统一封装在MI 命名空间下，调用形式参考：
MI.alert('封装调用layer.open()')，其它API参见`src/index.js`

# 未实现
- 热重载
- 小图片转base64
- 静态资源路径替换
- md5 签名

