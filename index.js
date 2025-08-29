// To use environment variables for your API key
require("dotenv").config();

// Assuming your new file is named 'itineraryGenerator.js'
const { generateItinerary } = require("./services/itineraryGenerator");

// User details provided as a clear string for a travel plan
const userPrompt = `
I want to plan a 5-day trip to Kerala. 
I'm really interested in the backwaters in Alleppey, the tea plantations in Munnar, and relaxing on Varkala beach. 
I'll be flying into Cochin.
`;

// Call the function and handle the response
generateItinerary(userPrompt)
  .then((itineraryJson) => {
    // We parse the JSON string to work with it as an object
    const itinerary = JSON.parse(itineraryJson);
    console.log("✅ Itinerary Generated Successfully!");
    console.log(JSON.stringify(itinerary, null, 2)); // Pretty-print the JSON
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });
