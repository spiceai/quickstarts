# Spice API Key Authentication

Spice supports protecting HTTP endpointa with API keys.

Add the following configuration to your `spicepod.yaml` to enable authentication:

```yaml
runtime:
  auth:
    api-key:
      enabled: true
      keys:
        - ${ env: API_KEY }
```

Then create a `.env` file in the same location as your `spicepod.yaml` with a key of your choice.

```shell
API_KEY=foobar
```

1. Start Spice with `spice run` and open a new terminal
2. Run `curl -XPOST -i http://localhost:8090/v1/sql -d 'SELECT 1'`:
```shell
curl -XPOST -i http://localhost:8090/v1/sql -d 'SELECT 1'
HTTP/1.1 401 Unauthorized
content-length: 12
date: Thu, 07 Nov 2024 01:52:00 GMT

Unauthorized
```

3. Run `curl -H "x-api-key: foobar" -XPOST -i http://localhost:8090/v1/sql -d 'SELECT 1'`
```shell
curl -H "x-api-key: foobar" -XPOST -i http://localhost:8090/v1/sql -d 'SELECT 1'
HTTP/1.1 200 OK
content-type: text/plain; charset=utf-8
x-cache: Miss from spiceai
content-length: 16
date: Thu, 07 Nov 2024 01:53:20 GMT

[{"Int64(1)":1}]
```

