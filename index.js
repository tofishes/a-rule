const { defaultTasks, prodTasks, gulp } = require('./gulpfile');

module.exports = function run(task) {
  let tasks = defaultTasks;

  if (task === 'production') {
    tasks = prodTasks;
  }

  gulp.run(tasks);
};
