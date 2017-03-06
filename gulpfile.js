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
  homePath: root,
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

loadTask(tasksDir, (tasks) => {
  Object.keys(tasks).map((taskName) => {
    const task = tasks[taskName];
    const deps = task.deps || [];

    gulp.task(task.name, deps, task.bind(gulp, options));

    if (~task.name.toLowerCase().indexOf('prod')) { // eslint-disable-line
      prodTasks.push(task.name);
    }

    if (~task.name.toLowerCase().indexOf('dev')) { // eslint-disable-line
      defaultTasks.push(task.name);
    }

    return task;
  });
});

gulp.task('dev', defaultTasks);
gulp.task('prod', prodTasks);

// task 可选值为 dev | prod
function run(task = 'dev', opts = {}) {
  Object.assign(options, opts);

  gulp.start(task);
}

module.exports = { run, defaultTasks, prodTasks };

