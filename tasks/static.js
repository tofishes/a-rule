/**
 * static任务：
 * copy静态文件到目标目录
 */
const remove = require('del');
const log = require('t-log');

function statical(options) {
  const gulp = this;

  const src = options.srcDir + options.staticDir;
  const dist = options.distDir + options.staticDir;

  const timer = log.start('static');

  // remove first
  remove.sync(dist);

  const stream = gulp.src(`${src}/**/*`)
    .pipe(gulp.dest(dist));

  timer.end();

  return stream;
}

statical.production = true;
statical.development = true;

module.exports = statical;
