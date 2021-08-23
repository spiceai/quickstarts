# Log Pruner

A CPU based log pruning example.

This example uses CPU metrics to anticipate the best time to prune logs.  It pulls CPU metrics from a [Flux Annotated CSV](https://docs.influxdata.com/influxdb/cloud/reference/syntax/annotated-csv/) file and uses them to determine likely times of low load.

## Train

First, ensure this `quickstarts` repository is cloned.

```bash
git clone https://github.com/spiceai/quickstarts.git
```

Move to the `log-pruner` directory and start the Spice AI runtime.

```bash
cd quickstarts
cd log-pruner
spice run
```

Once the Spice runtime has loaded, add the LogPruner example using another terminal.

```bash
cd quickstarts
cd log-pruner
spice pod add samples/LogPruner
```

In the Spice runtime terminal, you will observe the runtime load CPU metrics and begin to train!

## Inference

Now try fetching a recommendation from the newly trained pod.

```bash
curl http://localhost:8000/api/v0.1/pods/logpruner/inference
```

You'll see a result telling you if now is a good time to prune logs or not, along with Spice AI's confidence in that recommendation.  Cool!

```json
{
  "action": "prune_logs",
  "confidence": 0.95,
  "end": "2021-08-17T21:45:30",
  "start": "2021-08-17T21:35:30",
  "tag": "latest"
}
```
