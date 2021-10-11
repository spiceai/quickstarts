import fetch from "node-fetch";

console.log("Tweetrec v0.1!");
console.log("");
console.log("Ctrl-C to stop running");
console.log("");



/**
 * Fetches a recommendation from the Spice.ai endpoint for the tweetrec pod
 *
 * @returns Spice.ai Recommendation
 */
const fetchRecommendation = async () => {
  console.log("Fetching Tweetrec recommendation...");
  const response = await fetch(
    "http://localhost:8000/api/v0.1/pods/tweetrec/recommendation"
  ).catch((e) => {});

  if (!response || !response.ok) {
    if (response && response.status >= 500) {
      console.log(`An error occurred: ${response.statusText}`);
      return;
    }
    console.log(
      "Failed to fetch recommendation. Is the Spice.ai runtime started and has a pod been added?"
    );
    return;
  }

  const recommendation = await response.json();

  if (!recommendation.confidence) {
    console.log(
      "Recommendation has a confidence of 0. Has this pod been trained yet?"
    );
    return;
  }

  console.log(
    `Recommendation to ${recommendation.action.toUpperCase()} with ${
      recommendation.confidence
    } confidence.`
  );

  return recommendation;
};


const maybePerformTwitterAction= async () => {
  const recommendation = await fetchRecommendation();
  if (!recommendation) {
    return;
  }

  if (
    recommendation.action !== "do_nothing" &&
    recommendation.confidence > 0.5
  ) {
    if (recommendation.action === "tweet") {
      console.log("You should post a tweet");
    } else if (recommendation.action === "retweet") {
      console.log("You should post a retweet");
    }
    else if (recommendation.action === "comment") {
        console.log("You should comment on your latest post");
      }

    console.log();
  } else {
    console.log("Doing nothing....");
    console.log();
  }
};

maybePerformTwitterAction();

setInterval(async () => {
  return maybePerformTwitterAction();
}, 5000);
