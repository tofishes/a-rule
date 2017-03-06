/**
 * static任务：
 * copy静态文件到目标目录
 */
const newer = require('gulp-newer');
const remove = require('del');
const log = require('t-log');
const env = require('../utils/env');

function statical(envName, options) {
  const isDev = env.getEnv(envName).isDev;
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

      if (!statical.watched && isDev) {
        gulp.watch(matches, [statical.name]);
        log.debug('Start static task watching...');
        statical.watched = true;
      }
    });

  return stream;
}


function staticProd(opts) {
  return statical.call(this, 'production', opts);
}
function staticDev(opts) {
  return statical.call(this, 'development', opts);
}

module.exports = { staticProd, staticDev };
