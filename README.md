# Brails - Ropes on edge of sail for hauling up

Simple templating tool, inspired by Helm.

# TODO

- Support EJS and Handlebars
- Add `-c` flag to choose a config file
- Add `.brails.json` file as a config file

# Installation

```
git clone https://github.com/djupudga/brails.git
cd brails
npm install
npm link

# To test run:
brails -f examples/yaml -d examples/data.yaml
```

# Usage

```
brails -f path/to/yaml/file/or/files -d overrides.yaml
```

The above command inserts overrides defined in the `overrides.yaml` file
into the target YAML files using the EJS template language.

You can omit the `-d` flag, but then brails expects a `data.y(a)ml` to reside
in the same directory where it is executed. Thus, a minimal command would be:

```
cat some.yaml | brails
```

# Examples

```
# overrides.yaml
myService:
  externalPort: 80
  internalPort: 3000
extraService:
  enabled: false

# myService.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    port: <%- myService.externalPort %>
    targetPort: <%- myService.internalPort %>

# extraService.yaml
<% if (extraService.enabled) { %>
apiVersion: v1
kind: Service
metadata:
  name: extra-service
spec:
  selector:
    app: extra-app
  ports:
    port: 8080
<% } %>

```
