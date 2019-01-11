const yaml = require('js-yaml')
const indentString = require('indent-string')
const fs = require('fs')
const path = require('path')

module.exports = {
  indent: indentString,
  toYaml: obj => {
    return yaml.safeDump(obj).trim()
  },
  quote: i => {
    return `"${i}"`
  },
  trunc: (i, n) => {
    return i.length > n ? i.substring(0, n) : i
  },
  getFile(root) {
    return name => {
      return fs
        .readFileSync(path.resolve(process.cwd(), path.dirname(root), name))
        .toString()
    }
  },
  fileToBase64(root) {
    return name => {
      return Buffer.from(
        fs
          .readFileSync(path.resolve(process.cwd(), path.dirname(root), name))
          .toString()
      ).toString('base64')
    }
  },
  toBase64: data => {
    return Buffer.from(data).toString('base64')
  }
}
