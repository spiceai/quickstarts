# Trader

A basic Bitcoin trading bot example.

Let's try an example that uses data from a CSV file to train. We will be training a model that uses historical Bitcoin prices to learn when to trade effectively.

First, ensure this `quickstarts` repository is cloned.

```bash
git clone https://github.com/spiceai/quickstarts.git
```

Move to the `trader` directory and start the Spice runtime.

```bash
cd trader
spice run
```

In another terminal (also in the `trader` directory), add the Trader sample pod:

```bash
spice pod add samples/Trader
```

> ### Note

> If you are running this quickstart in GitHub Codespaces or VS Code, then you can click the split button in the terminal window to open a new terminal in split-view mode. This will allow you to see what the Spice AI runtime is doing while you run the CLI commands.

> ![alt](/.imgs/split_terminal.png)

In the Spice runtime terminal, you will observe the runtime loading the CSV from `data/btcusd.csv` and starting to train!

Now, let's update the starting balances for the portfolio so the app has more capital to trade with.

_Change_

```yaml
fields:
  - name: usd_balance
  initializer: 0 # update with the starting balance to train with
  - name: btc_balance
  initializer: 0 # update with the starting balance to train with
```

_to_

```yaml
fields:
  - name: usd_balance
    initializer: 1000
  - name: btc_balance
    initializer: 10
```

Feel free to try whatever amounts you'd like!

Now, save the file. You should observe a new training run begin in the Spice runtime. If you'd like to start training manually, use this command.

```bash
spice pod train trader
```

## Inference

Now try fetching a recommendation from the newly trained pod.

```bash
curl http://localhost:8000/api/v0.1/pods/trader/inference
```

You'll see a result you can take action on immediately:

```json
{
  "action": "buy",
  "confidence": 0.9,
  "end": "1607907600",
  "start": "1607886000",
  "tag": "latest"
}
```

## View Observation Data

Try fetching observation data with:

```bash
curl http://localhost:8000/api/v0.1/pods/trader/observations
```

## Integrate with your app

You can easily use your newly trained model in your app. Spice AI works with any language using a simple REST API. Here is a simple example that will fetch inferences for a Javascript app:

```js
const fetch = require("node-fetch");

console.log("Trader - A Spice app");

setInterval(async () => {
  let response = await fetch(
    "http://localhost:8000/api/v0.1/pods/trader/inference"
  );
  let data = await response.json();

  console.log(`${new Date().toISOString()}: ${data.action.toUpperCase()}!!!`);
}, 3000);
```

Create this file as `trader.js` in this quickstart folder. Then run the following:

```js
npm install node-fetch
node trader.js
```
