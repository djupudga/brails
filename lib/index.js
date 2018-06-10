'use strict'
const meow = require('meow')
const stdin = require('get-stdin')
const ejs = require('ejs')
const handlebars = require('handlebars')
const fs = require('fs')
const path = require('path')
const error = require('./error')
const loadYaml = require('./load-yaml')
const loadData = require('./load-data')
const helpers = require('./helpers')
let config = require('./config')

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
  if (config.templateEngine == 'ejs') {
    data.indent = helpers.indent
    data.toYaml = helpers.toYaml
    data.quote = helpers.quote
    data.trunc = helpers.trunc
    data.getFile = helpers.getFile
  } else if (config.templateEngine == 'handlebars') {
    // Register handlebars helpers
    handlebars.registerHelper('indent', helpers.indent)
    handlebars.registerHelper('toYaml', helpers.toYaml)
    handlebars.registerHelper('quote', helpers.quote)
    handlebars.registerHelper('trunc', helpers.trunc)
    handlebars.registerHelper('getFile', helpers.getFile)
  }
  // Expose environment variables to templates.
  data.env = process.env
  // Template processing and rendering starts here.
  let ps = []
  for (let y of yamlFiles) {
    if (y.file != 'stdin') {
      if (config.templateEngine == 'ejs') {
        data.getFile = (name) => {return fs.readFileSync(path.join(process.cwd(), y.file, '..', name)).toString()}
        ps.push(ejs.renderFile(y.file, data))
      } else if (config.templateEngine == 'handlebars') {
        handlebars.unregisterHelper('getFile')
        handlebars.registerHelper('getFile', (name) => {return fs.readFileSync(path.join(process.cwd(), y.file, '..', name)).toString()})
        ps.push(handlebars.compile(fs.readFileSync(y.file).toString(), {noEscape:true})(data))
      }
    } else {
      if (config.templateEngine == 'ejs') {
        ps.push(Promise.resolve(ejs.render(y.content, data)))
      } else if (config.templateEngine == 'handlebars') {
        ps.push(handlebars.compile(y.content, {noEscape:true})(data))
      }
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
  // Overwrite config var with, well, config.
  config = config(cli.flags.c)
  // Load file containing overrides and other settings.
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
