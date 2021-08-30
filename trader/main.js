import fetch from "node-fetch";

console.log("Trader - A Spice trading app");

const fetchRecommendation = async () => {
  console.log("Fetching trade recommendation...");
  const response = await fetch(
    "http://localhost:8000/api/v0.1/pods/trader/inference"
  ).catch((e) => {});

  if (!response || !response.ok) {
    console.log(
      "Failed to fetch recommendation. Is the Spice.ai runtime running?"
    );
    return;
  }

  const recommendation = await response.json();

  console.log(
    `Recommendation to ${recommendation.action.toUpperCase()} with ${
      recommendation.confidence
    } confidence.`
  );
};

fetchRecommendation();

setInterval(async () => {
  return fetchRecommendation();
}, 5000);
