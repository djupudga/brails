'use strict'
const path = require('path')
const yaml = require('js-yaml')
const fs = require('fs')

function verify(c) {
  switch (c.engine) {
    case 'ejs':
      return true
    case 'handlebars':
      return true
    default:
      throw new Error(`Unknown template engine ${c.engine} in config file`)
  }
}


module.exports = function(flags) {
  const file = path.join(process.cwd(), flags.c)
  // Default config
  let config = {
    engine: flags.engine
  }
  try {
    // Attempt to load local file
    config = yaml.safeLoad(fs.readFileSync(file))
  } catch (e) {
    // Attempt to load file in home folder
    try {
      config =
        yaml.safeLoad(fs.readFileSync(path.join(process.env.HOME, flags.c)))
    } catch (e) {
      // Do nothing
    }
  }
  // Merge flags into config
  config = Object.assign(config, flags)
  verify(config)
  return config
}
