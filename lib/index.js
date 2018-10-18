"use strict";
const meow = require("meow");
const stdin = require("get-stdin");
const ejs = require("ejs");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const error = require("./error");
const loadYaml = require("./load-yaml");
const dataYaml = require("./data-yaml");
const helpers = require("./helpers");
let config = require("./config");

const cli = meow(
  `
  Brails - Ropes on edge of sail for hauling up.

  Usage:
    $ brails [OPTION]

  Flags:
    -f, --file
      Path to YAML file or folder.
    -d, --data
      Path to YAML file containing substitution data.
    -o, --output
      Destination file for output.
    -e, --engine
      Template engine (ejs or handlebars)
    -c, --config
      Path to brails configuration file.
    --help
      Show this text
    --version
      Brails version

  Description:
    Brails accepts input from standard input and writes output to standard
    output. Input behaviour can be overridden by specifying the '-f' flag.
    Likewise, output can be overridden by specifying the '-o' flag.

    By default, brails takes data from 'data.y(a)ml' and uses it as context
    for substitution in target YAML templates. Brails looks for the
    'data.y(a)ml' in the working folder. An alternative data file can be
    specified using the '-d' flag.

    Brails supports EJS and Handlebars as templating languages, with EJS being
    the default. This can be overridden by a flag (-e).

    Brails can be configured using a config file (.brailsrc). All 
    non-abbreviated flags can be used, i.e. 'engine' but not 'e'.
    The config file format is YAML.

    Brails looks for the config file in the working folder. If not found, it
    will look in the user's home folder. Alternatively, a config file can
    be specified using the '-c' flag.

    Brails exposes environment variables to the template files in the
    'env' variable. For example, the environment variable 'HOME' can be
    accessed like this: env.HOME


  Examples:
    $ cat deploy.yaml | brails
    $ cat deploy.yaml | brails -d overrides.yaml -o deploy_ready.yaml
    $ brails -d data.yaml -f some-folder -c handlebars.json -o deploy_ready.yaml
    $ REPO_NAME=foo brails -d data.yaml -f some-folder

`,
  {
    flags: {
      file: {
        type: "string",
        alias: "f"
      },
      data: {
        type: "string",
        alias: "d"
      },
      output: {
        type: "string",
        alias: "o"
      },
      engine: {
        type: "string",
        alias: "e",
        default: "ejs"
      },
      config: {
        type: "string",
        alias: "c",
        default: ".brailsrc"
      }
    }
  }
);

async function render(yamlFiles, data) {
  // Set globals
  if (config.engine == "ejs") {
    data.indent = helpers.indent;
    data.toYaml = helpers.toYaml;
    data.quote = helpers.quote;
    data.trunc = helpers.trunc;
    data.toBase64 = helpers.toBase64;
  } else if (config.engine == "handlebars") {
    // Register handlebars helpers
    handlebars.registerHelper("indent", helpers.indent);
    handlebars.registerHelper("toYaml", helpers.toYaml);
    handlebars.registerHelper("quote", helpers.quote);
    handlebars.registerHelper("trunc", helpers.trunc);

    handlebars.registerHelper("toBase64", helpers.toBase64);
  }
  // Expose environment variables to templates.
  data.env = process.env;
  // Template processing and rendering starts here.
  let ps = [];
  for (let y of yamlFiles) {
    if (y.file != "stdin") {
      if (config.engine == "ejs") {
        data.getFile = helpers.getFile(y.file);
        data.fileToBase64 = helpers.fileToBase64(y.file);
        ps.push(ejs.renderFile(y.file, data));
      } else if (config.engine == "handlebars") {
        handlebars.unregisterHelper("getFile");
        handlebars.registerHelper("getFile", helpers.getFile(y.file));
        handlebars.registerHelper("fileToBase64", helpers.fileToBase64(y.file));
        ps.push(
          handlebars.compile(fs.readFileSync(y.file).toString(), {
            noEscape: true
          })(data)
        );
      }
    } else {
      if (config.engine == "ejs") {
        ps.push(Promise.resolve(ejs.render(y.content, data)));
      } else if (config.engine == "handlebars") {
        ps.push(handlebars.compile(y.content, { noEscape: true })(data));
      }
    }
  }
  let res = await Promise.all(ps);
  let contents = [];
  for (let txt of res) {
    txt = txt.trim();
    if (txt.length > 0) {
      contents.push(txt);
    }
  }
  const rendered = contents.join("\n---\n");
  if (config.output) {
    fs.writeFileSync(config.output, rendered);
  } else {
    console.log(rendered);
  }
}

stdin().then(str => {
  let yaml = str;
  // Overwrite config var with, well, config.
  config = config(cli.flags);
  // Load file containing overrides and other settings.
  let data = dataYaml.load(config.data);
  if (yaml) {
    // process yaml using data
    render([{ file: "stdin", content: yaml }], data);
  } else {
    // load yaml using flag
    if (config.file) {
      yaml = loadYaml(config.file);
      render(yaml, data);
    } else {
      error("No template file(s) defined");
    }
  }
});
