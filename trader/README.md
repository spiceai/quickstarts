# Trader

> **NOTE** This is an example only. Nothing from Spice AI ever constitutes financial advice.

A basic Bitcoin trading bot example.

Let's try an example that uses historical Bitcoin prices to learn when to make Buy and Sell trades.

## Requirements

- [Node.js 14](https://nodejs.org/)
- [Spice.ai](https://crispy-dollop-c329115a.pages.github.io/#/install)

## Setup

First, ensure this repository, `quickstarts` is cloned or is opened in GitHub Codespaces.

```bash
git clone https://github.com/spiceai/quickstarts.git
```

Move to the `trader` directory and start the Spice.ai runtime.

```bash
cd quickstarts
cd trader
spice run
```

So that you can watch the Spice.ai runtime output and enter commands at the same time, open another terminal (also in the `trader` directory).

> **Note**
> If you are using GitHub Codespaces or VS Code, then you can open a new terminal in split-view mode by clicking the 'split' button.
> ![alt](/.imgs/split_terminal.png)

Run npm install to setup the sample application.

```bash
npm install
```

## Run the sample application

```bash
node main.js
```

## Get the sample

In the new terminal add the Trader sample pod:

```bash
spice pod add samples/Trader
```

In the Spice.ai runtime terminal, you will observe the runtime loading the CSV from `data/btcusd.csv` and starting to train!

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
    initializer: 10000
  - name: btc_balance
    initializer: 1
```

Feel free to try whatever amounts you'd like!

Now, save the file. You should observe a new training run begin in the Spice.ai runtime terminal. You can also manually start a training run using this command.

```bash
spice pod train trader
```

## Recommendations

Now try fetching a recommendation from the newly trained pod.

```bash
curl http://localhost:8000/api/v0.1/pods/trader/inference
```

You'll see a result you can take action on immediately:

```json
{
  "action": "buy",
  "confidence": 0.9,
  "start": 1607886000,
  "end": 1607907600,
  "tag": "latest"
}
```

## Integrate with your app

You can easily use your newly trained model in your app. Spice.ai works with any language using a simple REST API. Here is a simple example that will fetch inferences for a Javascript app:

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

## Observation Data

You can also view observation data by fetching it with an API call:

```bash
curl http://localhost:8000/api/v0.1/pods/trader/observations
```

## Next steps

Congratulations! You've successfully trained a model that provides real-time recommendations for trades based on the sample data and your portfolio constraints!

If you were to extend this example to a real-world application, the next steps might be to replace the static CSV data with live streaming data and to further develop the reward functions to train a model that produces better recommendations.

Try tweaking the parameters in the pod manifest (`.spice/pods/trader.yaml`) to learn how the Spice.ai runtime behaves.
