const genAI = require("../config/gemini");

/**
 * Generates a travel itinerary tailored to a specific trip type.
 * @param {string} userPrompt - The user's description of their travel desires.
 * @param {string} [tripType='general'] - The type of trip (e.g., 'adventure-trek', 'cultural-immersion', 'relaxing-beach').
 * @returns {Promise<string>} A JSON string representing the generated itinerary.
 */
async function generateItinerary(userPrompt, tripType = 'general') {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.3, // Slightly higher for a bit of creativity in descriptions
    },
  });

  // --- DYNAMIC PROMPTING IMPLEMENTATION FOR TRAVEL ---
  // 1. A map of specific instructions for different trip types.
  const dynamicInstructions = {
    'adventure-trek': `
Special Focus: Emphasize physical activities like hiking, kayaking, and exploring nature. Prioritize national parks and off-the-beaten-path locations. Suggest practical accommodations like lodges or well-located hostels. The itinerary should feel energetic and action-packed.`,
    'cultural-immersion': `
Special Focus: Highlight historical sites, museums, local markets, and authentic culinary experiences (like cooking classes). Suggest boutique hotels or local guesthouses. The itinerary should be paced to allow for spontaneous discovery. Use descriptive language about the culture and history.`,
    'relaxing-beach': `
Special Focus: Center the itinerary on beaches, relaxation, and leisure. Include activities like spa treatments, lounging by the pool, and sunset dinners. Recommend high-quality resorts or beachfront villas. The pace should be slow and rejuvenating.`,
    'general': `
Special Focus: Create a balanced itinerary that includes major landmarks, popular activities, and some time for relaxation. This should be a well-rounded plan suitable for a first-time visitor.`
  };

  // 2. Select the appropriate instruction set, defaulting to 'general'.
  const selectedInstruction = dynamicInstructions[tripType] || dynamicInstructions['general'];

  // 3. The system prompt is now dynamic and includes the selected instructions.
  const systemPrompt = `
You are WanderlustAI, an expert AI-powered travel planner.
Your goal: Convert the user's travel ideas into a detailed, inspiring itinerary in JSON format.

${selectedInstruction}

Rules:
1. All JSON keys must be in camelCase (e.g., "tripName", "dailyItinerary").
2. Infer reasonable details if not provided (like suggesting specific restaurants or sites).
3. Only return a single, valid JSON object as a string, with no extra text, comments, or markdown.
`;

  const prompt = `${systemPrompt}\n\nUser Request:\n${userPrompt}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean the response just in case the model adds markdown formatting
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return cleanJson;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate content from the API.");
  }
}

module.exports = { generateItinerary };
