# Brails

Simple templating tool, inspired by Helm.

# Usage

```
brails -f path/to/yaml/file/or/files -d overrides.yaml
```

The above command inserts overrides defined in the `overrides.yaml` file
into the target YAML files using a template language similar to Mustache.

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
    port: {{ myService.externalPort }}
    targetPort: {{ myService.internalPort }}

# extraService.yaml
{{ if (extraService.enabled) { }}
apiVersion: v1
kind: Service
metadata:
  name: extra-service
spec:
  selector:
    app: extra-app
  ports:
    port: 8080
{{ } }}

```
