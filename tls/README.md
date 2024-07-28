# Securing data in transit via TLS

Encrypt traffic between Spice and clients using Transport Layer Security (TLS).

## Pre-requisites

- A TLS certificate and private key pair in PEM format. (i.e. `cert.pem` and `key.pem`)
- The certificate authority (CA) certificate that issued the above certificate in PEM format. (i.e. `ca.pem`)
  - Generate the above certificates by following the TLS sample if needed: https://github.com/spiceai/samples/tree/trunk/tls
- The latest version of Spice.

## Start Spice with TLS

Start the Spice runtime (`spiced`) with the TLS certificate and private key pair:

```bash
spiced --tls --tls-certificate-file /path/to/cert.pem --tls-private-key-file /path/to/key.pem
```

Alternatively, add the following section to `spicepod.yaml`:

```yaml
runtime:
  tls:
    certificate_file: /path/to/cert.pem
    key_file: /path/to/key.pem
```

## Connect to Spice with TLS

Use `curl` to connect to Spice with the `--cacert` option to specify the CA certificate to use to verify the connection:

```bash
curl --cacert /path/to/ca.pem https://localhost:8090/health
```

## Spice REPL over TLS

Use the Spice SQL REPL with the `--tls-root-certificate-file` option to connect to Spice with TLS and perform queries:

```bash
spice sql --tls-root-certificate-file /path/to/ca.pem
```