#!/usr/bin/env node
const program = require('commander');
const gulp = require('gulp');
const log = require('t-log');
require('../gulpfile');

program.on('--help', () => {
  log.warn('  Usage:');
  log.warn('  $', 'arule dev', '测试环境编译');
  log.warn('  $', 'arule prod', '生产环境编译');
});

program.parse(process.argv);
const task = program.args[0];
const right = ~['dev', 'prod'].indexOf(task); // eslint-disable-line

if (right) {
  gulp.start(task);
} else {
  program.help();
}
