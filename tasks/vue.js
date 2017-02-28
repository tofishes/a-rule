/**
 * js根目录下划分pages、components、common文件夹，pages/components分散编译，common下根据common/index.js合并编译
 * js任务：
 * 1、编译vue源码
 * 2、压缩，非正式环境生成sourcemap
 * 3、正式环境文件名生成hash，并生成js-map
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const remove = require('del');
const webpack = require('webpack');
const log = require('t-log');

// 根据webpack处理的chunks信息生成所需的js map对应关系
function generateJSMap(dist) {
  return function generate() {
    this.plugin('done', (stats) => {
      const mapJson = stats.toJson();
      const chunks = mapJson.chunks;
      const jsMap = {};
      const base = './src/js/pages/';

      chunks.map((chunk) => {
        chunk.files.map((hashFileName, index) => {
          const origin = chunk.origins[index];

          if (origin.name === 'common') {
            jsMap['common.js'] = hashFileName;
            return index;
          }

          if (origin.name === 'components') {
            jsMap['components.js'] = hashFileName;
            return index;
          }

          const module = origin.moduleName.replace(base, '');
          const pathId = module; // .replace(/\.js/, '').replace(/\//g, '-');

          jsMap[pathId] = hashFileName;

          return hashFileName;
        });

        return chunk;
      });

      fs.writeFileSync(path.join(dist, 'js-map.json'), JSON.stringify(jsMap));
    });
  };
}
// 读取所有的组件，并用文件名作为组件名，将组件注册代码生成到文件中
function registerComponents(componentsDir) {
  const indexFile = path.resolve(componentsDir, '../components.js');
  let template = '';

  glob.sync(`${componentsDir}/**/*`).map((file, i) => {
    const name = path.parse(file).name;

    const register = `
      const component${i} = require('${file}');
      Vue.component('${name}', component${i});`;

    template += register;

    return file;
  });

  fs.writeFile(indexFile, template);

  return indexFile;
}

function vue(options, callback) {
  const isDev = options.env.isDev;

  const src = options.srcDir + options.jsDir;
  const dist = options.distDir + options.jsDir;
  const componentsDir = `${options.srcDir}/components`;

  const timer = log.start('js');

  const componentsIndex = registerComponents(componentsDir);

  const entryMap = {
    'common': `${src}/common/index.js`,
    'components': componentsIndex
  };

  // 读取pages下的js文件
  glob.sync(`${src}/pages/**/*`).map((file) => {
    const filename = path.parse(file).name;
    entryMap[filename] = file;

    return file;
  });

  // webpack配置信息
  const config = {
    entry: entryMap,
    output: {
      filename: isDev ? '[name].js' : '[name].[chunkhash:8].js',
      path: dist
    },
    plugins: [
      generateJSMap(options.distDir)
    ],
    resolve: {
      alias: {
        components: path.resolve(options.homePath, options.srcDir + options.componentsDir)
      }
    },
    externals: {
      // 'vue': true // vue.js在common中或全局已引用，局部require vue用external的vue替代
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          use: ['vue-loader']
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'buble-loader'
        },
      ]
    }
  };

  if (options.env.isProduction) {
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: isDev,
        compress: {
          warnings: isDev,
          drop_console: !isDev,
        }
      })
    );
  }

  // remove first
  remove.sync(dist);

  // webpack run
  webpack(config, (err) => {
    callback(err);
    timer.end();
  });
}

module.exports = vue;
