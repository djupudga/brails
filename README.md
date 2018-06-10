# Brails - Ropes on edge of sail for hauling up

Simple templating tool, inspired by Helm.

# Installation

Prerequisites:
- git
- node (v8 or higher)

```
curl -o- https://raw.githubusercontent.com/djupudga/brails/master/install.sh | bash

# To try it with examples, run:
brails -f examples/yaml -d examples/data.yaml
```

# Usage

```
brails -f path/to/yaml/file/or/files -d overrides.yaml
```

The above command inserts overrides defined in the `overrides.yaml` file
into the target YAML files using the EJS or Handlebars template language.

You can omit the `-d` flag, but then brails expects a `data.y(a)ml` to reside
in the same directory where it is executed. Thus, a minimal command would be:

```
cat some.yaml | brails
```

# Configuration

By default, the EJS template language is used. This allows you to embed
JavaScript code in the YAML template files. The other template engine is
Handlebars. In order to use that, you either provide a `-c` flag pointing
to a config file, or create a `.brailsrc.json` file in the root folder of
where you execute the `brails` command. You may also have a `.brailsrc.json`
file in your home folder.

```
# .brailsrc.json for handlebars
{
  "templateEngine": "handlebars"
}

# .brailsrc.json for ejs
{
  "templateEngine": "ejs"
}
```

# Examples

Check out the `examples` folder for EJS and Handlebars template examples.

# TODO

- Support EJS and Handlebars
- Add `-c` flag to choose a config file
- Add `.brails.json` file as a config file
