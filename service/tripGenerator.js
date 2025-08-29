const genAI = require("../config/gemini");

/**
 * Generates a travel itinerary based on a user's prompt.
 * @param {string} userPrompt - A string containing the user's travel preferences.
 * @returns {Promise<string>} A JSON string representing the travel itinerary.
 */
async function generateItinerary(userPrompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Multi-shot prompt with a travel-themed example
  const prompt = `
You are WanderlustAI, an expert AI-powered travel planner.
Your task is to generate a detailed travel itinerary based ONLY on the user information provided.

You MUST adhere strictly to the following JSON format. Do not add, remove, or rename any fields from this structure.

The required JSON schema is:
{
  "trip_name": "string",
  "destination": "string",
  "trip_summary": "A 2-3 sentence summary of the trip's theme.",
  "suggested_activities": ["string"],
  "daily_itinerary": [
    {
      "day": "number",
      "location": "string",
      "plan": ["string"]
    }
  ],
  "accommodation": [
    {
      "name": "string",
      "city": "string",
      "type": "string (e.g., 'Hotel', 'Hostel', 'Airbnb')"
    }
  ],
  "transportation": [
    {
      "mode": "string (e.g., 'Flight', 'Train', 'Rental Car')",
      "details": "string"
    }
  ]
}

EXAMPLE 1
User Details:
---
I want to plan a 4-day trip to Bali. I love beaches, surfing, and exploring temples. I'll be flying in and want to stay in a villa.
---

Expected JSON:
{
  "trip_name": "Bali Beach & Temple Discovery",
  "destination": "Bali, Indonesia",
  "trip_summary": "An adventurous 4-day escape to Bali, combining the thrill of surfing on its iconic beaches with the serenity of exploring ancient cultural temples.",
  "suggested_activities": ["Surfing", "Beach Hopping", "Temple Tours", "Local Cuisine"],
  "daily_itinerary": [
    {
      "day": 1,
      "location": "Seminyak",
      "plan": ["Arrive at Denpasar Airport (DPS)", "Check into the villa in Seminyak", "Relax at Seminyak Beach and watch the sunset"]
    },
    {
      "day": 2,
      "location": "Canggu & Uluwatu",
      "plan": ["Morning surf session at Canggu", "Visit the Uluwatu Temple in the afternoon", "Watch a traditional Kecak fire dance"]
    },
    {
      "day": 3,
      "location": "Ubud",
      "plan": ["Day trip to Ubud", "Explore the Tegalalang Rice Terraces", "Visit the Sacred Monkey Forest Sanctuary"]
    },
    {
        "day": 4,
        "location": "Seminyak",
        "plan": ["Enjoy a final Balinese breakfast", "Last-minute souvenir shopping", "Depart from Denpasar Airport (DPS)"]
    }
  ],
  "accommodation": [
    {
      "name": "Private Villa Seminyak (example)",
      "city": "Seminyak",
      "type": "Villa"
    }
  ],
  "transportation": [
    {
      "mode": "Flight",
      "details": "Fly into Ngurah Rai International Airport (DPS)"
    },
    {
      "mode": "Scooter Rental",
      "details": "Recommended for local travel between beaches and towns"
    }
  ]
}

---
User Details:
${userPrompt}
---
Expected JSON:
`;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    // Clean up the response to ensure it's valid JSON
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return cleanJson;
  } catch (err) {
    throw new Error("Error generating itinerary: " + err.message);
  }
}

module.exports = { generateItinerary };
