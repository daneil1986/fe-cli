#!/usr/bin/env node
const program = require('commander');
const shell = require('shelljs');
const chalk = require('chalk');
const inquirer = require('inquirer');
const clone = require('../lib/clone');

program
  .version(require('../package.json').version)
  .usage('<command> [options]')

program
  .command('init')
  .alias('i')
  .description('请选择模版初始化工程')
  .action(function () {
    require('figlet')('S K R F E', function (err, data) {
      if (data) {
        console.log(chalk.red(data))
      }
      console.log('目前fe-cli支持以下模板:');
      console.log('pc   - 后台管理工程')
      console.log('h5   - 前端H5工程')

      const prompt = inquirer.createPromptModule()
      prompt({
        type: 'list',
        name: 'type',
        message: '项目类型:',
        default: 'pc   - 后台管理工程',
        choices: [
          'pc   - 后台管理工程',
          'h5   - 前端H5工程'
        ]
      }).then(res => {
        const type = res.type.split(' ')[0]
        prompt({
          type: 'input',
          name: 'project',
          message: '项目名称:',
          validate: function (input) {
            const done = this.async()
            setTimeout(function () {
              if (!input) {
                done('请输入项目名称！')
                return
              }
              done(null, true)
            }, 0)
          }
        }).then(pRes => {
          const project = pRes.project
          prompt({
            type: 'list',
            name: 'type',
            message: '拉取方式:',
            default: 'ssh   - SSH',
            choices: [
              'ssh   - SSH',
              'http   - HTTP'
            ]
          }).then(gitRes => {
            const gittype = gitRes.type.split(' ')[0]
            let pwd = shell.pwd()
            let gitUrl = gittype === 'ssh' ? 'git@git.inframe.club:fe' : 'http://git.inframe.club/fe'
            clone(`${gitUrl}/${type}-template.git`, pwd + `/${project}`, {
              success() {
                shell.rm('-rf', pwd + `/${project}/.git`)
                console.log(`项目地址: ${pwd}/${project}/`)
                console.log('接下来你可以:')
                console.log('')
                console.log(chalk.blue(`    $ cd ${project}`))
                console.log(chalk.blue(`    $ npm install || yarn install`))
                console.log(chalk.blue(`    $ npm start`))
                console.log('')
              },
              fail(err) {
                console.log(chalk.red(`${err}`));
              },
              onData(data = '') {
                const d = data.toString();
                if (d.indexOf('fatal') !== -1 || d.indexOf('error') !== -1) {
                  console.log(chalk.red(`${data}`));
                } else {
                  console.log(chalk.blue(`${data}`));
                }
              },
            })
          })
        })
      })
    })
  }).on('--help', function () {
    console.log('')
    console.log('Examples:')
    console.log('')
    console.log(chalk.blue('  $ cli-fe i'))
    console.log(chalk.blue('  $ cli-fe init'))
    console.log('');
    console.log('可用模板:')
    console.log('pc   - 后台管理工程')
    console.log('h5   - 前端H5工程')
  })
program.parse(process.argv);