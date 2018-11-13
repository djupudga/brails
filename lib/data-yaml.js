"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

function load(dataYamlPath) {
  if (dataYamlPath) {
    return yaml.safeLoad(fs.readFileSync(dataYamlPath));
  } else {
    const pwd = process.cwd();
    const paths = [`${pwd}/data.yaml`, `${pwd}/data.yml`];
    for (let p of paths) {
      if (fs.existsSync(p)) {
        return yaml.safeLoad(fs.readFileSync(p));
      }
    }
    return {};
    // throw new Error('No default data file found')
  }
}

module.exports = {
  load: load
};
