### Follow these steps to get started running Spice.ai in Kubernetes.

**Step 1.** (Optional) Start a local [`kind`](https://kind.sigs.k8s.io/) cluster:

```bash
go install sigs.k8s.io/kind@v0.22.0
kind create cluster
```

See [kind installation](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) for other installation options.

**Step 2.** Install Spice in your Kubernetes cluster using Helm:

```bash
helm repo add spiceai https://helm.spiceai.org
helm install spiceai spiceai/spiceai
```

**Step 3.** Verify that the Spice pods are running:

```bash
kubectl get pods
kubectl logs deploy/spiceai
```

**Step 4.** Run the Spice SQL REPL inside the running pod:

```bash
kubectl exec -it deploy/spiceai -- spiced --repl
```

**Step 5.** Run these queries in the Spice SQL REPL:

```sql
show tables;
describe taxi_trips;
select * from taxi_trips limit 10;
```

**Step 6.** Create a `values.yaml` file to configure the Spice deployment:

```bash
cat <<EOF > values.yaml
spicepod:
  name: app
  version: v1beta1
  kind: Spicepod

  datasets:
    - from: s3://spiceai-demo-datasets/taxi_trips/2024/
      name: taxi_trips_customized
      description: Demo taxi trips in s3
      params:
        file_format: parquet
      acceleration:
        enabled: true
EOF
```

**Step 7.** Update the Spice deployment with the new configuration:

```bash
helm upgrade spiceai spiceai/spiceai -f values.yaml
```
