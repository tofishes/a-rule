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
# 运行测试编译并启动watch：
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


## 结合gulp使用

若采用 `npm install --save-dev a-rule` 安装到局部而非全局，则需要使用gulp来执行任务。

```
const gulp = require('gulp');
const arule = require('a-rule');

gulp.task('default', arule.defaultTasks);
gulp.task('production', arule.prodTasks);

// other task
gulp.task('others', ['yoursTask'].concat(arule.defaultTasks));
```

a-rule暴露给外部的属性有：
* run [Function]

  arule.run(envName, [options])，执行任务

  envName: 'development' | 'production'
  options:
  ```
  const options = {
    homePath: root,  // root is process.cwd()
    srcDir: `${root}/src`,
    cssDir: '/css',
    jsDir: '/js',
    imageDir: '/image',
    staticDir: '/static',
    distDir: `${root}/assets`,
    componentsDir: '/components',
    verbose: false, // 是否显示详细过程信息
    env // env = { isDev, isProduction, 'name': 'development' }
  };
  ```

* defaultTasks [Array]

  arule.defaultTasks 默认的任务列表，一般是开发环境

* prodTasks [Array]

  arule.prodTasks 默认的生产任务列表

