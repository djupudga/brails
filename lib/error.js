'use strict'
module.exports = function(msg) {
  console.error(`\n  Error: ${msg}\n`)
  process.exit(1)
}
