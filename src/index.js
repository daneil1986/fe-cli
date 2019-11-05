#!/usr/bin/env node
const program = require('commander');

program
  .version(require('../package.json').version)
  .usage('<command> [options]')
  .command('new', 'generate a new project from a template')
  .command('page', 'genereate a new page from a template')
  .parse(process.argv);
