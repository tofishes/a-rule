/**
 * css根目录下划分pages和common文件夹，pages分散编译，common下根据common/index.styl合并编译
 * css任务：
 * 1、编译stylus源码
 * 2、对图片base64编码
 * 3、开发环境不压缩，正式环境压缩
 * 4、文件名生成hash，并生成css-map
 */
const rev = require('gulp-rev');
const noop = require('gulp-noop');
const sourcemaps = require('gulp-sourcemaps');
const base64 = require('gulp-css-base64');
const stylus = require('gulp-stylus');
const cleanCss = require('gulp-clean-css');  // 压缩css
const newer = require('gulp-newer');
const remove = require('del');
const normalizeCss = require('normalize.css.styl');
const poststylus = require('poststylus');
const log = require('t-log');
const env = require('../utils/env');

const stylusConfig = {
  // 'include': [path.join(__dirname, './node_modules/'), __dirname],
  'include css': true,
  'use': [normalizeCss(), poststylus(['autoprefixer'])],
  // 'rawDefine': {
  //   '$app-config': appConfig // 传递变量对象给样式文件使用
  // }
};
const base64Config = {
  maxWeightResource: 12 * 1024 // 12k
  // extensionsAllowed: ['.gif', '.jpg', '.png']
};

function css(envName, options) {
  const gulp = this;
  const isDev = env.getEnv(envName).isDev;

  const cssSrc = options.srcDir + options.cssDir;
  const cssDist = options.distDir + options.cssDir;
  const src = [`${cssSrc}/pages/**/*`, `${cssSrc}/common/index.styl`];

  const timer = log.start('css');

  // remove first
  remove.sync(cssDist);

  // build
  const stream = gulp.src(src)
    .pipe(newer(cssDist))
    .pipe(isDev ? sourcemaps.init() : noop())
    .pipe(stylus(stylusConfig))
    .pipe(base64(base64Config))
    .pipe(isDev ? noop() : cleanCss()) // 开发环境不压缩
    .pipe(rev())
    .pipe(isDev ? sourcemaps.write('.') : noop())
    .pipe(gulp.dest(cssDist))
    .pipe(rev.manifest({
      path: 'css-map.json',
      merge: true
    }))
    .pipe(gulp.dest(options.distDir))
    .on('end', () => {
      timer.end();

      if (!css.watched && isDev) {
        gulp.watch(src.concat([`${cssSrc}/common/**/*`]), () => cssDev(options));
        log.debug('Start css task watching...');
        css.watched = true;
      }
    });

  return stream;
}

function cssProd(opts) {
  return css.call(this, 'production', opts);
}
function cssDev(opts) {
  return css.call(this, 'development', opts);
}

module.exports = { cssProd, cssDev };
