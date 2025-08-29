
require("dotenv").config();


const { generateItinerary } = require("./services/itineraryGenerator");


const userPrompt = `
I want to plan a 5-day trip to Kerala. 
I'm really interested in the backwaters in Alleppey, the tea plantations in Munnar, and relaxing on Varkala beach. 
I'll be flying into Cochin.
`;

generateItinerary(userPrompt)
  .then((itineraryJson) => {
    const itinerary = JSON.parse(itineraryJson);
    console.log("✅ Itinerary Generated Successfully!");
    console.log(JSON.stringify(itinerary, null, 2)); // Pretty-print the JSON
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });
