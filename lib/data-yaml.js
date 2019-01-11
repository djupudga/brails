const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

function load(dataYamlPath) {
  if (dataYamlPath) {
    return yaml.safeLoad(fs.readFileSync(dataYamlPath))
  } else {
    const pwd = process.cwd()
    const paths = [`${pwd}/data.yaml`, `${pwd}/data.yml`]
    for (let p of paths) {
      if (fs.existsSync(p)) {
        return yaml.safeLoad(fs.readFileSync(p))
      }
    }
    return {}
    // throw new Error('No default data file found')
  }
}

function load2(dataYamlPath) {
  let dc = { content: '', file: 'stdin' }
  if (dataYamlPath) {
    dc.content = fs.readFileSync(dataYamlPath).toString()
    dc.file = dataYamlPath
    return dc
  } else {
    const pwd = process.cwd()
    const paths = [`${pwd}/data.yaml`, `${pwd}/data.yml`]
    for (let p of paths) {
      if (fs.existsSync(p)) {
        dc.content = fs.readFileSync(p).toString()
        dc.file = p
        return dc
      }
    }
    return { file: 'stdin', content: '' }
    // throw new Error('No default data file found')
  }
}

module.exports = {
  load: load,
  load2: load2
}
