module.exports = function(cli, msg) {
  console.error(`\n  Error: ${msg}\n`)
  cli.showHelp()
}
