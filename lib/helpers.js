'use strict'

const yaml = require('js-yaml')
const indentString = require('indent-string')

module.exports = {
  indent: indentString,
  toYaml: (obj) => {return yaml.safeDump(obj).trim()},
  quote: (i) => {return `"${i}"`},
  trunc: (i, n) => {return i.length > n? i.substring(0, n): i},
  getFile: (name) => {return fs.readFileSync(path.join(process.cwd(), name)).toString()}
}
