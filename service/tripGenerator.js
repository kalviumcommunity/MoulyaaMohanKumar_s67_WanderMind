const genAI = require("../config/gemini");

/**
 * Generates a travel itinerary using multi-shot prompting for better accuracy.
 * @param {string} userPrompt - The user's description of their travel desires.
 * @param {string} [tripType='general'] - The type of trip to influence the AI's focus.
 * @returns {Promise<string>} A JSON string representing the generated itinerary.
 */
async function generateItinerary(userPrompt, tripType = 'general') {
  const model = genAI.getGenerativeModel({
    model: "gemini-1-flash",
    generationConfig: {
      temperature: 0.3,
    },
  });

  const dynamicInstructions = {
    'adventure-trek': `
Special Focus: Emphasize physical activities like hiking and exploring nature. The itinerary should feel energetic.`,
    'cultural-immersion': `
Special Focus: Highlight historical sites, museums, and local markets. The itinerary should be rich in culture.`,
    'relaxing-beach': `
Special Focus: Center the itinerary on beaches, relaxation, and leisure. The pace should be slow and rejuvenating.`,
    'general': `
Special Focus: Create a balanced itinerary suitable for a first-time visitor.`
  };

  const selectedInstruction = dynamicInstructions[tripType] || dynamicInstructions['general'];

  const systemPrompt = `
You are WanderlustAI, an expert AI-powered travel planner.
Your goal: Convert the user's travel ideas into a detailed, inspiring itinerary in JSON format.

${selectedInstruction}

Rules:
1. All JSON keys must be in camelCase (e.g., "tripName", "dailyItinerary").
2. Infer reasonable details if not provided (like suggesting specific restaurants or sites).
3. Only return a single, valid JSON object as a string, with no extra text, comments, or markdown.
`;

  // --- MULTI-SHOT PROMPT EXAMPLES ---
  // We provide two distinct examples (adventure vs. cultural) to give the model
  // a better understanding of how to handle different types of requests.
  const examples = `
EXAMPLE 1 (Adventure)
User Request:
I want to go to Costa Rica for a week. I love hiking in rainforests, seeing wildlife like monkeys and sloths, and maybe trying ziplining.
Expected JSON:
{
  "tripName": "Costa Rica Rainforest Adventure",
  "destination": "Costa Rica",
  "tripSummary": "A 7-day adventure through Costa Rica's lush rainforests, focusing on wildlife encounters, hiking, and thrilling activities like ziplining.",
  "dailyItinerary": [
    { "day": 1, "location": "La Fortuna", "plan": ["Arrive in San José (SJO), transfer to La Fortuna", "Settle in and view the Arenal Volcano at sunset"] },
    { "day": 2, "location": "La Fortuna", "plan": ["Hike the Arenal Volcano National Park trails", "Afternoon relaxation at Tabacón Hot Springs"] },
    { "day": 3, "location": "Monteverde", "plan": ["Travel to Monteverde", "Night walk to spot nocturnal wildlife"] },
    { "day": 4, "location": "Monteverde", "plan": ["Explore the Monteverde Cloud Forest Reserve on hanging bridges", "Exhilarating ziplining canopy tour in the afternoon"] }
  ]
}

EXAMPLE 2 (Cultural Immersion)
User Request:
I'd like a 4-day cultural trip to Kyoto, Japan. I want to see historic temples, walk through traditional districts, and experience a tea ceremony.
Expected JSON:
{
  "tripName": "Kyoto Cultural Discovery",
  "destination": "Kyoto, Japan",
  "tripSummary": "A 4-day immersive journey into the heart of ancient Japan, exploring Kyoto's serene temples, historic geisha districts, and timeless traditions.",
  "dailyItinerary": [
    { "day": 1, "location": "Kyoto", "plan": ["Arrive in Kyoto, check into a Ryokan", "Evening stroll through the Gion district"] },
    { "day": 2, "location": "Kyoto", "plan": ["Visit the golden Kinkaku-ji temple", "Explore the Arashiyama Bamboo Grove", "Participate in a traditional Japanese tea ceremony"] },
    { "day": 3, "location": "Kyoto", "plan": ["Walk through the thousands of torii gates at Fushimi Inari Shrine", "Visit the historic Kiyomizu-dera Temple"] }
  ]
}
`;

  // The final prompt combines the system instructions, multiple examples, and the new user request.
  const prompt = `${systemPrompt}\n\n${examples}\n\nUser Request:\n${userPrompt}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return cleanJson;
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate content from the API.");
  }
}

module.exports = { generateItinerary };

