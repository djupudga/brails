'use strict'

const fs = require('fs')
const path = require('path')

function isYaml(file) {
  return (
    file.toLowerCase().endsWith('.yaml') ||
    file.toLowerCase().endsWith('.yml')
  )
}

function readYamlFiles(dir, contents) {
  let files = fs.readdirSync(dir)
  for (let file of files) {
    const subPath = path.join(dir, file)
    const stat = fs.statSync(subPath)
    if (stat.isDirectory()) {
      readYamlFiles(subPath, contents)
    } else if (isYaml(subPath)) {
      let content = {
        file: subPath,
        content: fs.readFileSync(subPath).toString()
      }
      contents.push(content)
    }
  }
}

module.exports = function(dir) {
  const stat = fs.statSync(dir)
  if (stat.isDirectory()) {
    // list files in directory
    let contents = []
    readYamlFiles(dir, contents)
    return contents
  } else {
    let content = {
      file: dir,
      content: fs.readFileSync(dir).toString()
    }
    return [content]
  }
}
