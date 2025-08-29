const genAI = require("../config/gemini");

// --- Constants for better maintainability ---
const MODEL_NAME = "gemini-1.5-flash";
const DEFAULT_PLAN_TYPE = 'general';

/**
 * A map of specific instructions for different travel plan types.
 * This allows the AI to dynamically adapt its itinerary-crafting strategy.
 */
const DYNAMIC_INSTRUCTIONS = {
  'adventure': `
Special Focus: Prioritize off-the-beaten-path experiences, physical activities (hiking, kayaking, climbing), and unique, rustic accommodations. The itinerary should be energetic and focus on natural wonders.`,
  'luxury': `
Special Focus: Emphasize 5-star accommodations, fine dining reservations, private tours, and exclusive experiences (e.g., spa treatments, yacht trips). The pace should be relaxed and comfortable.`,
  'family-friendly': `
Special Focus: Select activities suitable for all ages, including children. Prioritize safety, convenience, and educational fun. Include parks, interactive museums, and family-friendly restaurants. Ensure lodging has appropriate amenities.`,
  'budget': `
Special Focus: Maximize experiences while minimizing costs. Suggest hostels or budget hotels, public transportation, free attractions (parks, walking tours), and affordable local eateries.`,
  'cultural': `
Special Focus: Build the itinerary around historical sites, museums, art galleries, local workshops (e.g., cooking classes), and authentic cultural performances. Emphasize immersion in the local heritage and lifestyle.`
};

/**
 * Generates a tailored travel itinerary in JSON format using WanderMind AI.
 * @param {string} userPrompt - A string containing the user's travel query (e.g., "7 days in Japan, love history and food").
 * @param {string} [planType='general'] - The type of travel plan (e.g., 'adventure', 'luxury', 'family-friendly').
 * @returns {Promise<object>} A promise that resolves to the parsed JSON itinerary object.
 * @throws {Error} Throws an error if the API call fails or the response is not valid JSON.
 */
async function generateTravelItinerary(userPrompt, planType = DEFAULT_PLAN_TYPE) {
  // --- Input Validation ---
  if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
    throw new Error("Invalid userPrompt: Must be a non-empty string.");
  }

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      temperature: 0.5, // Slightly higher temp for more creative travel ideas
    },
  });

  // --- Dynamic Prompt Construction ---
  const selectedInstruction = DYNAMIC_INSTRUCTIONS[planType] || `Create a balanced and general-purpose travel itinerary.`;

  const systemPrompt = `
You are WanderMind AI, an expert travel assistant and itinerary planner.
Your goal is to convert a user's travel request into a structured, helpful, and inspiring itinerary in JSON format.

${selectedInstruction}

Core Rules:
1.  The JSON output must have a root key 'itinerary'.
2.  The 'itinerary' object should contain 'destination', 'durationDays', and an array named 'dailyPlan'.
3.  Each object in 'dailyPlan' must have 'day', 'title', and an array of 'activities'.
4.  All JSON keys must be in camelCase.
5.  Your entire response must be a single, valid JSON object and nothing else. Do not include any explanatory text or markdown formatting like \`\`\`json.
`;

  const fullPrompt = `${systemPrompt}\n\nUser's Travel Request:\n${userPrompt}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const rawText = response.text();

    // --- Critical Step: Parse and Validate JSON output ---
    try {
        const jsonResponse = JSON.parse(rawText);
        return jsonResponse;
    } catch (parseError) {
        console.error("Error parsing JSON from API response:", rawText);
        throw new Error("Failed to generate a valid JSON itinerary. The AI's response was malformed.");
    }

  } catch (apiError) {
    console.error("Error calling the Generative AI API:", apiError);
    throw new Error("Failed to generate content due to an API error.");
  }
}

module.exports = { generateTravelItinerary };
