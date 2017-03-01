/**
 * static任务：
 * copy静态文件到目标目录
 */
const newer = require('gulp-newer');
const remove = require('del');
const log = require('t-log');

function statical(options) {
  const gulp = this;

  const src = options.srcDir + options.staticDir;
  const dist = options.distDir + options.staticDir;
  const matches = `${src}/**/*`;

  const timer = log.start('static');

  // remove first
  remove.sync(dist);

  const stream = gulp.src(matches)
    .pipe(newer(dist))
    .pipe(gulp.dest(dist))
    .on('end', () => {
      timer.end();

      if (!statical.watched && options.env.isDev) {
        gulp.watch(matches, [statical.name]);
        log.debug('Start static task watching...');
        statical.watched = true;
      }
    });

  return stream;
}

statical.production = true;
statical.development = true;

module.exports = statical;
