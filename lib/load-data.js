'use strict'
const yaml = require('js-yaml')
const fs = require('fs')

module.exports = function(path) {
  if (path) {
    return yaml.safeLoad(fs.readFileSync(path))
  } else {
    const pwd = process.cwd()
    const paths = [`${pwd}/data.yaml`, `${pwd}/data.yml`]
    for (p of paths) {
      if (fs.existsSync(p)) {
        return yaml.safeLoad(fs.readFileSync(p))
      }
    }
    throw new Error('No default data file found')
  }
}
