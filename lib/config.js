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
    config = require(file)
  } catch (e) {
    // Do nothing
  }
  verify(config)
  return config
}
