# Log Pruner

A CPU based log pruning example.

This example uses CPU metrics to anticipate the best time to prune logs. It pulls CPU metrics from a [Flux Annotated CSV](https://docs.influxdata.com/influxdb/cloud/reference/syntax/annotated-csv/) file and uses them to determine likely times of low load.

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

> ### Note

> If you are running this quickstart in GitHub Codespaces or VS Code, then you can click the split button in the terminal window to open a new terminal in split-view mode. This will allow you to see what the Spice AI runtime is doing while you run the CLI commands.

> ![alt](/.imgs/split_terminal.png)

In the Spice runtime terminal, you will observe the runtime load CPU metrics and begin to train!

## Inference

Now try fetching a recommendation from the newly trained pod.

```bash
curl http://localhost:8000/api/v0.1/pods/logpruner/inference
```

You'll see a result telling you if now is a good time to prune logs or not, along with Spice AI's confidence in that recommendation. Cool!

```json
{
  "action": "prune_logs",
  "confidence": 0.95,
  "start": 1629237960,
  "end": 1629238560,
  "tag": "latest"
}
```

## Next steps

You've successfully trained a model that can tell you when it is a good time to prune logs or not! In a real application you would want to continually be adding in new CPU metrics as observations so that calls to the `/inference` API gives recommendations about the live data. To see how this can be done, check out the [Log Pruner Sample](https://github.com/spiceai/samples/blob/trunk/log-pruner/README.md).
