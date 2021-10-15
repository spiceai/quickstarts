# Tweet Recommendation

This quickstart demonstrates a basic tweet recommendation tool.

Given the past tweet activity and metrics of a given account, this app can recommend when to tweet, comment, or retweet to maximize for like count, interaction rates, and outreach of said given Twitter account. This information is useful to marketing accounts where follower interaction and the reach of your posts is of great importance. In this quickstart, you will use the Spice CLI to add the necessary pod, train it, and use a sample node script in to fetch recommendations from it. 

## Requirements

- [Node.js 14](https://nodejs.org/)
- [Spice.ai](https://docs.spiceai.org/getting-started/install-spiceai/)

## Setup

First, ensure this repository, `quickstarts` is cloned or is opened in GitHub Codespaces.

```bash
git clone https://github.com/spiceai/quickstarts.git
```

Move to the `tweet-recommendation` directory and start the Spice.ai runtime.

```bash
cd quickstarts
cd tweet-recommendation
spice run
```

So that you can watch the Spice.ai runtime output and enter commands at the same time, open another terminal (also in the `tweet-recommendation` directory).

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
Tweet-recommendation v0.1!

Ctrl-C to stop running

Fetching twitter action recommendation...
Failed to fetch recommendation. Is the Spice.ai runtime started and has a pod been added?
```

The quickstart application will attempt to fetch a recommendation from the Spice.ai runtime but will not find one, because we have not yet created a pod and trained it. Press Ctrl-C to close the quickstart application and add a pod in the next step.

## Get the quickstart pod

In the new terminal add the tweet-recommendation quickstart pod from spicerack.org:

```bash
spice add quickstarts/tweet-recommendation
```

In the Spice.ai runtime terminal, you will observe the runtime loading the CSV from `spicepods/data/tweet_activity.csv` and starting to train!

To train the pod again, either edit and save the file `/spicepods/tweet-recommendation.yaml` or run the following command
```bash
spice train tweet-recommendation
```
If you tweak the reward functions in the yaml file, retrain the pod to see the updated output

You can view the pod training progress at: [http://localhost:8000/pods/tweet-recommendation](http://localhost:8000/pods/tweet-recommendation).

## Recommendations

Once the pod has trained, re-run the quickstart application:

```bash
node main.js
```

Now you should see output with a recomendation (recommendation may differ from this quickstart as this depends on the trained model):

```bash
Tweet-recommendation v0.1!

Ctrl-C to stop running

Fetching tweet activity recommendation...
Recommendation to RETWEET with 0.818 confidence.
You should post a retweet

Fetching tweet activity recommendation...
Recommendation to TWEET with 0.724 confidence.
You should post a tweet

Fetching tweet activity recommendation...
Recommendation to COMMENT with 0.745 confidence.
You should comment on your latest post

Fetching tweet activity recommendation...
Recommendation to COMMENT with 0.718 confidence.
You should comment on your latest post

```

You can also fetch a recommendation directly from the API.

```bash
curl http://localhost:8000/api/v0.1/pods/tweet-recommendation/recommendation
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
```

## Observation Data

You can also view observation data by fetching it with an API call:

```bash
curl http://localhost:8000/api/v0.1/pods/tweet-recommendation/observations
```

## Next steps

Congratulations! You've successfully trained a model that provides real-time recommendations for Twitter marketing accounts based off of performance of previous tweets and retweets.

If you were to extend this example to a real-world application, the next steps might be to replace the static CSV data with live streaming data and to further develop the reward functions to train a model that produces better recommendations.

Perhaps you could also add richer twitter data, maybe run some NLP, or use a more active/different Twitter account as your data source.

Try tweaking the parameters in the pod manifest (`spicepods/tweet-recommendation.yaml`) to learn how the Spice.ai runtime behaves.
