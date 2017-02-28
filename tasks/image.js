/**
 * image任务：
 * 1、压缩优化image
 * 2、copy到目标目录
 */
const remove = require('del');
const imagemin = require('gulp-imagemin');
const cached = require('gulp-cached');
const log = require('t-log');

function image(options) {
  const gulp = this;

  const src = options.srcDir + options.imageDir;
  const dist = options.distDir + options.imageDir;

  const timer = log.start('image');

  // remove first
  remove.sync(dist);

  const stream = gulp.src(`${src}/**/*`)
    .pipe(cached())
    .pipe(imagemin({
      verbose: options.verbose
    }))
    .pipe(gulp.dest(dist));

  timer.end();

  return stream;
}

image.production = true;

module.exports = image;
