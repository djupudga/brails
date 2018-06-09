# Brails

Simple templating tool, inspired by Helm.

# TODO

- Test other template engines, handlebars etc.

# Installation

```
git clone https://github.com/djupudga/brails.git
cd brails
npm link
```

# Usage

```
brails -f path/to/yaml/file/or/files -d overrides.yaml
```

The above command inserts overrides defined in the `overrides.yaml` file
into the target YAML files using the Mustache template language.

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
    port: <% myService.externalPort %>
    targetPort: <% myService.internalPort %>

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
