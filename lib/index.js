'use strict'
const meow = require('meow')
const stdin = require('get-stdin')
const ejs = require('ejs')
const fs = require('fs')
const yaml = require('js-yaml')
const indentString = require('indent-string')
const error = require('./error')
const loadYaml = require('./load-yaml')
const loadData = require('./load-data')

const cli = meow(`
  This is brails

  Usage:
    brails -f dir/file -d overrides.yaml -o output.yaml
    cat file.yaml | brails
`, {
  flags: {
    file: {
      type: 'string',
      alias: 'f'
    },
    data: {
      type: 'string',
      alias: 'd'
    },
    output: {
      type: 'string',
      alias: 'o'
    }
  }
})


async function render(yamlFiles, data) {
  // Set globals
  data.indent = indentString
  data.toYaml = (obj) => {return yaml.safeDump(obj)}
  data.quote = (i) => {return `"${i}"`}
  data.trunc =(i, n) => {return i.length > n? i.substring(0, n): i}
  let ps = []
  for (let y of yamlFiles) {
    if (y.file != 'stdin') {
      ps.push(ejs.renderFile(y.file, data))
    } else {
      ps.push(Promise.resolve(ejs.render(y.content, data)))
    }
  }
  let res = await Promise.all(ps)
  let contents = []
  for (let txt of res) {
    txt = txt.trim()
    if (txt.length > 0) {
      contents.push(txt)
    }
  }
  const rendered = contents.join('\n---\n')
  if (cli.flags.o) {
    fs.writeFileSync(cli.flags.o, rendered)
  } else {
    console.log(rendered)
  }
}

stdin().then(str => {
  let yaml = str
  let data = loadData(cli.flags.d)
  if (yaml) {
    // process yaml using data
    render([{file: 'stdin', content: yaml}], data)
  } else {
    // load yaml using flag
    if (cli.flags.f) {
      yaml = loadYaml(cli.flags.f)
      render(yaml, data)
    } else {
      error('No template file(s) defined')
    }
  }
})
