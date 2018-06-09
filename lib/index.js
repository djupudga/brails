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

let yaml = ''
let data = {}

const cli = meow(`
  This is brails
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

stdin().then(str => {
  yaml = str
  if (yaml) {
    // process yaml using data
    console.log(yaml)
  } else {
    // load yaml using flag
    if (cli.flags.f) {
      yaml = loadYaml(cli.flags.f)
      data = loadData(cli.flags.d)
      // Set globals
      data.indent = indentString
      data.quote = (i) => {return `"${i}"`}
      data.trunc =(i, n) => {return i.length > n? i.substring(0, n): i}
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
    } else {
      error('No template file(s) defined')
    }
  }
})
