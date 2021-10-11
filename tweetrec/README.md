# Tweet Recommendations

A basic bot to recommend twitter activity for brand marketing accounts

Let's use a brand that has a very active twitter presence

## Requirements

- [Node.js 14](https://nodejs.org/)
- [Spice.ai](https://docs.spiceai.org/getting-started/install-spiceai/)

## Setup

First, ensure this repository, `quickstarts` is cloned or is opened in GitHub Codespaces.

```bash
git clone https://github.com/spiceai/quickstarts.git
```

Move to the `tweetrec` directory and start the Spice.ai runtime.

```bash
cd quickstarts
cd tweetrec
spice run
```

So that you can watch the Spice.ai runtime output and enter commands at the same time, open another terminal (also in the `tweetrec` directory).

> **Note**
> If you are using GitHub Codespaces or VS Code, then you can open a new terminal in split-view mode by clicking the 'split' button.
> ![alt](/.imgs/split_terminal.png)

Run npm install in the new terminal to setup the quickstart application.

```bash
npm install
```

## Run the quickstart application

```bash
node main.js
```

You should see the following output:

```bash
Tweetrec - a twitter recommendation engine
Fetching twitter action recommendation...
Failed to fetch recommendation. Is the Spice.ai runtime started and has a pod been added?
```

The quickstart application will attempt to fetch a recommendation from the Spice.ai runtime but will not find one, because we have not yet created a pod and trained it. Press Ctrl-C to close the quickstart application and let's add a pod in the next step.

## Get the quickstart pod

In the new terminal add the Tweetrec quickstart pod from spicerack.org:

```bash
spice add quickstarts/tweetrec
```

In the Spice.ai runtime terminal, you will observe the runtime loading the CSV from `spicepods/data/new_NZXT_tweets.csv` and starting to train!

You should observe a new training run begin in the Spice.ai runtime terminal. You can also manually start a training run using this command.

```bash
spice train tweetrec
```

You can view the pod training progress at: [http://localhost:8000/pods/tweetrec](http://localhost:8000/pods/tweetrec).

## Recommendations

Once the pod has trained, re-run the quickstart application:

```bash
node main.js
```

Now you should see output with a recomendation (recommendation may differ from this quickstart as this depends on the trained model):

```bash
Tweetrec - a twitter recommendation engine
Fetching twitter action recommendation...

```

You can also fetch a recommendation directly from the API.

```bash
curl http://localhost:8000/api/v0.1/pods/tweetrec/recommendation
```

You'll see a result you can take action on immediately:

```json
{
    "start":1633694400,
    "end":1633824000,
    "action":"tweet",
    "confidence":0.851,
    "tag":"latest"
}

## Observation Data

You can also view observation data by fetching it with an API call:

```bash
curl http://localhost:8000/api/v0.1/pods/tweetrec/observations
```

## Next steps

Congratulations! You've successfully trained a model that provides real-time recommendations for twitter marketing accounts based off of performance of previous tweets and retweets

If you were to extend this example to a real-world application, the next steps might be to replace the static CSV data with live streaming data and to further develop the reward functions to train a model that produces better recommendations.
Perhaps you could also add richer twitter data, maybe run some NLP, or use a more active/different twitter account. 

Try tweaking the parameters in the pod manifest (`spicepods/tweetrec.yaml`) to learn how the Spice.ai runtime behaves.
