'use strict'
const path = require('path')


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
    config = require(file)
  } catch (e) {
    // Attempt to load file in home folder
    try {
      config = require(path.join(process.env.HOME, '.brailsrc.json'))
    } catch (e) {
      // Do nothing
    }
  }
  // Merge flags into config
  config = Object.assign(config, flags)
  verify(config)
  return config
}
