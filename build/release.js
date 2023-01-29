const path = require('path')
const inquirer = require('inquirer')
const packageInfo = require('../package.json')
const packagePath = path.join(__dirname, '../package.json')
const { updatePackage, publish, addTag } = require('./utils')

const currentVersion = packageInfo.version
const packageName = packageInfo.name

inquirer
  .prompt([
    {
      name: 'version',
      message: `当前版本号: ${currentVersion}\n  输入新版本号: `,
      type: 'input',
      default: '',
    },
  ])
  .then((answers) => {
    updatePackage({ version: answers.version, private: false }, packagePath)
    publish()
    updatePackage({ version: currentVersion, private: true }, packagePath)
    addTag(answers.version, packageName)
  })
