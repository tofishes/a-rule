const path = require('path');
const glob = require('glob');
const gulp = require('gulp');
const mkdirp = require('mkdirp');
const log = require('t-log');
const { exec } = require('child_process');

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

    deps.push(task.bind(gulp, options))

    gulp.task(task.name, gulp.series.apply(gulp, deps));

    if (~task.name.toLowerCase().indexOf('prod')) { // eslint-disable-line
      prodTasks.push(task.name);
    }

    if (~task.name.toLowerCase().indexOf('dev')) { // eslint-disable-line
      defaultTasks.push(task.name);
    }

    return task;
  });
});

defaultTasks.push(cb => {
  log.success('building has done...all watching has started.');
  cb();
})
prodTasks.push(cb => {
  log.success('building has done.');
  cb();
})

gulp.task('dev', gulp.parallel.apply(gulp, defaultTasks));
gulp.task('prod', gulp.parallel.apply(gulp, prodTasks));
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
// deprecated
function run(task = 'dev', opts = {}) {
  Object.assign(options, opts);

  exec(`gulp ${task}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  })
}

module.exports = { run, defaultTasks, prodTasks };

