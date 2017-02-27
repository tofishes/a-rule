/**
 * image任务：
 * 1、压缩优化image
 * 2、copy到目标目录
 */
const remove = require('del');
const imagemin = require('gulp-imagemin');
const cached = require('gulp-cached');

function image(options) {
  const gulp = this;

  const src = options.srcDir + options.imageDir;
  const dist = options.distDir + options.imageDir;

  // remove first
  remove.sync(dist);

  const stream = gulp.src(`${src}/**/*`)
    .pipe(cached())
    .pipe(imagemin({
      verbose: options.env.isDev
    }))
    .pipe(gulp.dest(dist));

  return stream;
}

image.production = true;

module.exports = image;
