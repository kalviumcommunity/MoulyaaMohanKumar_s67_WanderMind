const genAI = require("../config/gemini");

async function generateTravelItinerary(userPrompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // Config is kept strict to guide the model without examples
    generationConfig: {
      temperature: 0.2,
      topP: 0.85,
    },
  });

  // --- ZERO-SHOT PROMPT ---
  // No examples are provided. The AI must rely solely on the instructions.
  const zeroShotPrompt = `
You are WanderMind AI, an expert AI-powered travel assistant.
Your task is to generate a detailed travel itinerary based ONLY on the user's request.

You MUST adhere strictly to the following JSON schema. Do not add, remove, or rename any fields from this structure. Your entire response must be ONLY the JSON object, with no extra text or markdown.

The required JSON schema is:
{
  "destination": "string (City, Country)",
  "tripType": "string (e.g., 'Adventure', 'Cultural', 'Luxury')",
  "durationDays": "number",
  "summary": "A 2-3 sentence summary of the trip's theme.",
  "suggestedActivities": ["An array of key activity strings"],
  "dailyPlan": [
    {
      "day": "number",
      "theme": "string (A theme for the day's activities)",
      "details": ["An array of strings describing the plan for the day"]
    }
  ]
}

---

Now generate the JSON for this user:

User Details:
---
${userPrompt}
---
`;

  try {
    const result = await model.generateContent(zeroShotPrompt);
    const rawText = result.response.text();
    // Clean potential markdown and trim whitespace
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    // Return a parsed JSON object
    return JSON.parse(cleanJson);
  } catch (err) {
    throw new Error("Error generating travel itinerary: " + err.message);
  }
}

module.'exports' = { generateTravelItinerary };
