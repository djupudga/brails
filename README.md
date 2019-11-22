# Brails - Ropes on edge of sail for hauling up

Simple templating tool, inspired by Helm. adfasdf

# Installation

Download the latest release from the release page:
https://github.com/djupudga/brails/releases.

Move the downloaded file to your **PATH** and make it executable. For example
for linux, you would do this:

```shell
cd Downloads
chmod +x brails-linux
sudo mv brails-linux /usr/bin/brails
```

## Install using node.js

Prerequisites:

- git
- node (v8 or higher)

```
curl -o- https://raw.githubusercontent.com/djupudga/brails/master/install.sh | bash

# Verify installation
brails --help

# To try it with examples, run:
brails -f examples/ejs -d examples/data.yaml
```

# Usage

Run `brails --help` information on how to use it.

# Examples

Check out the `examples` folder for EJS and Handlebars template examples.
