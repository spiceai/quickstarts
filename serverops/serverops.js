import fetch from "node-fetch";

console.log("Server Ops v0.1!");
console.log("");
console.log("Ctrl-C to stop running");
console.log("");

/*  This is a server ops application written in Node.js that queries Spice.ai
 *  for intelligent recommendations on when it would be a good time to perform
 *  various server operations.
 *  This application will only take the recommendation if the confidence is higher than 50%.
 *  As an example, this application checks every 5 seconds however in a real server monitoring
 *  application this period would likely be longer, such as every 5mins
 */

/**
 * Fetches a recommendation from the Spice.ai endpoint for the serverops pod
 *
 * @returns Spice.ai Recommendation
 */
const fetchRecommendation = async () => {
  console.log("Fetching Server Ops recommendation...");
  const response = await fetch(
    "http://localhost:8000/api/v0.1/pods/serverops/recommendation"
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

/**
 * Attempts to perform server maintenance based on the Spice.ai
 * recommendation
 */
const maybePerformMaintenance = async () => {
  const recommendation = await fetchRecommendation();
  if (!recommendation) {
    return;
  }

  if (
    recommendation.action !== "do_nothing" &&
    recommendation.confidence > 0.5
  ) {
    if (recommendation.action === "perform_maintenance") {
      console.log("Performing server maintenance now!");
    } else if (recommendation.action == "preload_cache") {
      console.log("Preloading cache now!");
    }

    console.log();
  } else {
    console.log("Not performing any server operations");
    console.log();
  }
};

maybePerformMaintenance();

setInterval(async () => {
  return maybePerformMaintenance();
}, 5000);
