'use strict'
const meow = require('meow')
const stdin = require('get-stdin')
const _ = require('lodash')
const fs = require('fs')
const indentString = require('indent-string')
const error = require('./error')
const loadYaml = require('./load-yaml')
const loadData = require('./load-data')

// Mustache style templates
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g

const cli = meow(`
  This is brails

  Usage:
    brails -f dir/file -d overrides.yaml -o output.yaml
    cat file.yaml |
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

function render(yaml, data) {
  // Set globals
  data.indent = indentString
  data.quote = (i) => {return `"${i}"`}
  data.trunc =(i, n) => {return i.length > n? i.substring(0, n): i}
  // Render YAML templates
  let contents = []
  for (let y of yaml) {
    let txt = _.template(y)(data)
    if (txt.trim().length > 0) {
      contents.push(txt)
    }
  }
  if (cli.flags.o) {
    fs.writeFileSync(cli.flags.o, contents.join('\n---\n'))
  } else {
    console.log(contents.join('\n---\n'))
  }
}

stdin().then(str => {
  let yaml = str
  let data = loadData(cli.flags.d)
  if (yaml) {
    // process yaml using data
    render([yaml], data)
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
