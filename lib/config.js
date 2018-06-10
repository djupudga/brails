'use strict'
const path = require('path')


function verify(c) {
  switch (c.templateEngine) {
    case 'ejs':
      return true
    case 'handlebars':
      return true
    default:
      throw new Error(`Unknown template engine ${c.templateEngine} in config file`)
  }
}


module.exports = function(file) {
  file = file || '.brailsrc.json'
  file = path.join(process.cwd(), file)
  // Default config
  let config = {
    templateEngine: 'ejs'
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
  verify(config)
  return config
}
