# a-rule
一个gulp+webpack2的编译范式。

js支持vuejs框架。css预处理引擎支持stylus。

## 安装

```
npm install -g a-rule
```

## 使用

```
# 帮助
$ arule --help
# 运行测试编译：
$ arule dev
# 运行生产编译：
$ arule prod
```

## 项目源码目录结构

```
./src
 |-- components            # vue组件存放目录，*.vue
 |-- js
      |-- common           # 全局js存放目录
          |-- index.js     # 全局js入口文件， 在此文件中引入其他模块，例如require('vue')
      |-- pages            # 页面级的js，通常是跟页面相关的业务代码
 |-- css
      |-- common           # 全局css存放目录
          |-- index.styl   # 全局css入口文件， 在此文件中引入其他模块，例如@import('normolize')
      |-- pages            # 页面级的css，通常是跟页面相关的样式代码
 |-- image                 # 图片文件
 |-- static                # 静态文件，不需要任何处理的文件，例如fonts文件等
```

## 编译结果

执行编译后，代码会生成到和src同级的assets目录，同时该目录下生成 css-map.json 和 js-map.json。

*-map.json用于保存编译后加md5的文件名映射，通过读取这些map.json在页面中引用正确的编译路径。

dev和prod都会生成这些map文件，用于保持结果一致。

