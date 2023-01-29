const fs = require('fs')
const { execSync } = require('child_process')
const updatePackage = (obj, packagePath, packages) => {
  let fileData
  if (packages) {
    fileData = packages
  } else {
    fileData = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
    Object.keys(obj).forEach((key) => {
      fileData[key] = obj[key]
    })
  }
  fs.writeFileSync(packagePath, JSON.stringify(fileData, null, 2))
}

const publish = () => {
  execSync('npm publish')
}

const addTag = (version, name) => {
  execSync(`yarn config set version-tag-prefix ${name}`)

  // execSync('yarn config set version-sign-git-tag false') //有可能打tag失败了，有可能是因为这个设置了true，手动设置成false就好
  execSync(`yarn version --new-version ${version}`)
}

const commitCode = (msg) => {
  execSync('git add .')
  execSync(`git commit -m ${msg}`)
  execSync('git pull')
  execSync('git push')
}

module.exports = {
  updatePackage,
  publish,
  addTag,
  commitCode,
}
