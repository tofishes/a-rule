const glob = require('glob');
const gulp = require('gulp');
const env = require('./utils/env');

const root = process.cwd();

function loadTask(dir, callback) {
  const files = glob.sync(`${dir}/**/*.js`, {
    cwd: __dirname
  });
  files.forEach((file) => {
    const task = require(file); // eslint-disable-line
    callback(task);
  });
}

const options = {
  homePath: process.cwd(),
  srcDir: `${root}/src`,
  cssDir: '/css',
  jsDir: '/js',
  imageDir: '/image',
  staticDir: '/static',
  distDir: `${root}/assets`,
  componentsDir: '/components',
  verbose: false, // 是否显示详细过程信息
  env
};

const prodTasks = [];
const defaultTasks = [];

const tasksDir = './tasks';

loadTask(tasksDir, (task) => {
  const deps = task.deps || [];
  gulp.task(task.name, deps, task.bind(gulp, options));

  if (task.production !== false) {
    prodTasks.push(task.name);
  }

  if (task.development !== false) {
    defaultTasks.push(task.name);
  }
});

gulp.task('default', defaultTasks);
gulp.task('production', prodTasks);
gulp.task('dev', defaultTasks);
gulp.task('prod', prodTasks);

function run(envName = 'development', opts = {}) {
  opts.env = env.getEnv(envName);

  Object.assign(options, opts);

  gulp.start(opts.env.isProduction ? 'production' : 'default');
}

module.exports = { run, defaultTasks, prodTasks };

