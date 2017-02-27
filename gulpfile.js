const glob = require('glob');
const gulp = require('gulp');
const env = require('./utils/env');

function loadTask(dir, callback) {
  const files = glob.sync(`${dir}/**/*.js`);
  files.forEach((file) => {
    const task = require(file); // eslint-disable-line
    callback(task);
  });
}

const options = {
  homePath: process.cwd(),
  srcDir: './src',
  cssDir: '/css',
  jsDir: '/js',
  imageDir: '/image',
  staticDir: '/static',
  distDir: './assets',
  componentsDir: '/components',
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

function runTask(envName = 'development', opts = {}) {
  opts.env = env.getEnv(envName);

  Object.assign(options, opts);

  if (opts.env.isProduction) {
    gulp.start(prodTasks);

    return;
  }

  gulp.start(defaultTasks);
}

module.exports = { runTask, defaultTasks, prodTasks };

