const path = require('path');
const glob = require('glob');
const gulp = require('gulp');
const mkdirp = require('mkdirp');
const log = require('t-log');

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
  verbose: false // 是否显示详细过程信息
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
// 创建项目目录
const initDirs = [
  './src/components',
  './src/css/common',
  './src/css/pages',
  './src/image',
  './src/js/common',
  './src/js/pages',
  './src/static',
  './views',
  './routers',
];
const initFiles = {
  './init/index.styl': './src/css/common',
  './init/index.js': './src/js/common'
};
gulp.task('init', () => {
  initDirs.map((dir) => {
    mkdirp.sync(dir);
    log.info(`${dir} is created...`);

    return dir;
  });

  Object.keys(initFiles).map((srcFile) => {
    gulp.src(path.resolve(__dirname, srcFile))
      .pipe(gulp.dest(initFiles[srcFile]));

    return srcFile;
  });

  log.debug('The project has inited!');
});

// task 可选值为 dev | prod
function run(task = 'dev', opts = {}) {
  Object.assign(options, opts);

  gulp.start(task);
}

module.exports = { run, defaultTasks, prodTasks };

