#!/usr/bin/env node
const program = require('commander');
const arule = require('../gulpfile');
const log = require('t-log');

program.on('--help', () => {
  log.warn('  Usage:');
  log.warn('  $', 'arule dev', '测试环境编译');
  log.warn('  $', 'arule prod', '生产环境编译');
});

program.parse(process.argv);
const task = program.args[0];
const right = ~['dev', 'prod'].indexOf(task); // eslint-disable-line

if (right) {
  arule.run(task);
} else {
  program.help();
}
