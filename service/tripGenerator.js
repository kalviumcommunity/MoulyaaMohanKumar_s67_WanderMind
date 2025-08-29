const genAI = require("../config/gemini");

async function generateTravelItinerary(userPrompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // --- IMPLEMENTED topP and tuned temperature for structured output ---
    generationConfig: {
      temperature: 0.2, // Low temperature for predictability
      topP: 0.85,         // Considers the smallest set of words whose probabilities add up to 85%
    },
  });

  // --- REPURPOSED PROMPT FOR WANDERMIND AI ---
  // Few-shot prompt with a new schema and travel-specific examples.
  const examples = `
You are WanderMind AI, an expert AI-powered travel assistant.
Your task is to generate a detailed travel itinerary based ONLY on the user information provided.

You MUST adhere strictly to the following JSON format. Do not add, remove, or rename any fields from this structure.

The required JSON schema is:
{
  "destination": "string",
  "tripType": "string (e.g., 'Adventure', 'Cultural', 'Luxury')",
  "durationDays": "number",
  "summary": "A 2-3 sentence summary of the trip's theme.",
  "suggestedActivities": ["string"],
  "dailyPlan": [
    {
      "day": "number",
      "theme": "string",
      "details": ["string"]
    }
  ]
}

EXAMPLE 1
User Details:
---
Anjali wants a 3-day adventure trip to Rishikesh. She loves rafting and wants to try bungee jumping.
---

Expected JSON:
{
  "destination": "Rishikesh, Uttarakhand",
  "tripType": "Adventure",
  "durationDays": 3,
  "summary": "An action-packed 3-day adventure in Rishikesh, the adventure capital of India. This itinerary focuses on thrilling river activities and adrenaline-pumping experiences.",
  "suggestedActivities": ["White Water Rafting", "Bungee Jumping", "Camping", "Attending Ganga Aarti"],
  "dailyPlan": [
    {
      "day": 1,
      "theme": "River Thrills & Spiritual Evenings",
      "details": ["Morning: Arrive and check into a riverside camp.", "Afternoon: Experience a 16 km white water rafting session.", "Evening: Witness the Ganga Aarti ceremony at Triveni Ghat."]
    },
    {
      "day": 2,
      "theme": "Adrenaline & Exploration",
      "details": ["Morning: Head to the bungee jumping point for the ultimate thrill.", "Afternoon: Explore the Lakshman Jhula and Ram Jhula bridges.", "Evening: Relax at a local cafe."]
    },
    {
      "day": 3,
      "theme": "Sunrise and Departure",
      "details": ["Morning: Short trek to a nearby waterfall for sunrise views.", "Afternoon: Depart from Rishikesh."]
    }
  ]
}

EXAMPLE 2
User Details:
---
Rohan is planning a 2-day cultural tour of Bengaluru. He's interested in history, palaces, and gardens. He doesn't need adventure activities.
---

Expected JSON:
{
  "destination": "Bengaluru, Karnataka",
  "tripType": "Cultural",
  "durationDays": 2,
  "summary": "A 2-day cultural immersion in Bengaluru, exploring the city's rich history, grand palaces, and beautiful botanical gardens.",
  "suggestedActivities": ["Explore Bangalore Palace", "Visit Lalbagh Botanical Garden", "Walk through Cubbon Park", "See Vidhana Soudha"],
  "dailyPlan": [
    {
      "day": 1,
      "theme": "Royalty and Nature",
      "details": ["Morning: Explore the magnificent Bangalore Palace and its grounds.", "Afternoon: Stroll through the historic Lalbagh Botanical Garden and see the Glass House.", "Evening: Enjoy a traditional South Indian dinner in Basavanagudi."]
    },
    {
      "day": 2,
      "theme": "History and Governance",
      "details": ["Morning: Visit the Visvesvaraya Industrial & Technological Museum.", "Afternoon: Walk through Cubbon Park and admire the Vidhana Soudha from the outside.", "Evening: Depart from Bengaluru."]
    }
  ]
}

---

Now generate the JSON for this new user:

User Details:
---
${userPrompt}
---
`;

  try {
    const result = await model.generateContent(examples);
    const rawText = result.response.text();
    // Clean potential markdown and trim whitespace
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    // Return a parsed JSON object, which will throw an error if the format is invalid
    return JSON.parse(cleanJson);
  } catch (err) {
    throw new Error("Error generating travel itinerary: " + err.message);
  }
}

module.exports = { generateTravelItinerary };
