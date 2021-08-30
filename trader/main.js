import fetch from "node-fetch";

console.log("Trader - A Spice trading app");

/**
 * Fetches a recommendation from the Spice.ai endpoint for the trader pod
 *
 * @returns Spice.ai Recommendation
 */
const fetchRecommendation = async () => {
  console.log("Fetching trade recommendation...");
  const response = await fetch(
    "http://localhost:8000/api/v0.1/pods/trader/recommendation"
  ).catch((e) => {});

  if (!response || !response.ok) {
    if (response.status >= 500) {
      console.log(`An error occurred: ${response.statusText}`);
      return;
    }
    console.log(
      "Failed to fetch recommendation. Has a pod been added yet?"
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

/**
 * Maybe prints a trade execution to the console based on the Spice.ai
 * recommendation
 */
const maybeExecuteTrade = async () => {
  const recommendation = await fetchRecommendation();
  if (!recommendation) {
    return;
  }

  if (recommendation.action != "hold" && recommendation.confidence > 0.75) {
    console.log(`Submitting ${recommendation.action.toUpperCase()} order.`);
  } else {
    console.log("Holding.");
  }
};

maybeExecuteTrade();

setInterval(async () => {
  return maybeExecuteTrade();
}, 3000);
