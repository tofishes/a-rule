/**
 * image任务：
 * 1、压缩优化image
 * 2、copy到目标目录
 */
const remove = require('del');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const log = require('t-log');

function image(options) {
  const gulp = this;

  const src = options.srcDir + options.imageDir;
  const dist = options.distDir + options.imageDir;
  const matches = `${src}/**/*`;

  const timer = log.start('image');

  // remove first
  remove.sync(dist);

  const stream = gulp.src(matches)
    .pipe(newer(dist))
    .pipe(imagemin({
      verbose: options.verbose
    }))
    .pipe(gulp.dest(dist))
    .on('end', () => {
      timer.end();

      if (!image.watched && options.env.isDev) {
        gulp.watch(matches, [image.name]);
        log.debug('Start image task watching...');
        image.watched = true;
      }
    });

  return stream;
}

image.production = true;

module.exports = image;
