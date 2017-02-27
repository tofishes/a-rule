/**
 * static任务：
 * copy静态文件到目标目录
 */
const remove = require('del');

function statical(options) {
  const gulp = this;

  const src = options.srcDir + options.staticDir;
  const dist = options.distDir + options.staticDir;

  // remove first
  remove.sync(dist);

  const stream = gulp.src(`${src}/**/*`)
    .pipe(gulp.dest(dist));

  return stream;
}

statical.production = true;
statical.development = true;

module.exports = statical;
