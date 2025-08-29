const genAI = require("../config/gemini");

// --- Constants for better maintainability ---
const MODEL_NAME = "gemini-1-flash";
const DEFAULT_PLAN_TYPE = 'general';

// --- Dynamic Instructions for the Creative Step ---
const DYNAMIC_INSTRUCTIONS = {
  'adventure': `Special Focus: Prioritize off-the-beaten-path experiences, physical activities (hiking, kayaking, climbing), and unique, rustic accommodations. The itinerary should be energetic and focus on natural wonders.`,
  'luxury': `Special Focus: Emphasize 5-star accommodations, fine dining reservations, private tours, and exclusive experiences (e.g., spa treatments, yacht trips). The pace should be relaxed and comfortable.`,
  'family-friendly': `Special Focus: Select activities suitable for all ages, including children. Prioritize safety, convenience, and educational fun. Include parks, interactive museums, and family-friendly restaurants.`,
  'budget': `Special Focus: Maximize experiences while minimizing costs. Suggest hostels or budget hotels, public transportation, free attractions (parks, walking tours), and affordable local eateries.`,
  'cultural': `Special Focus: Build the itinerary around historical sites, museums, art galleries, local workshops (e.g., cooking classes), and authentic cultural performances. Emphasize immersion in the local heritage and lifestyle.`
};

/**
 * STEP 1: Brainstorm creative travel ideas in an unstructured format.
 */
async function _generateItineraryIdeas(userPrompt, planType) {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const selectedInstruction = DYNAMIC_INSTRUCTIONS[planType] || `Create a balanced and general-purpose travel itinerary.`;

    const brainstormingPrompt = `
You are a world-class travel expert and creative blogger.
Based on the user's request, brainstorm a rich, detailed list of potential activities, places to visit, food suggestions, and hidden gems.
${selectedInstruction}
IMPORTANT: Do NOT worry about JSON or any strict structure. Output your ideas as a detailed, free-flowing text. Be creative and specific.

User's Travel Request:
${userPrompt}
`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: brainstormingPrompt }] }],
        generationConfig: { temperature: 0.7 }, // Higher temp for creativity
    });
    return result.response.text();
}

/**
 * STEP 2: Structure the brainstormed ideas into a clean JSON object using few-shot examples.
 */
async function _structureIdeasIntoJson(unstructuredIdeas) {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const structuringPrompt = `
You are a meticulous data formatting expert. Your ONLY job is to convert the unstructured travel ideas into a perfect JSON object, following the exact pattern in the examples provided.

### EXAMPLES ###

INPUT:
"Let's plan 2 days in Paris. Day 1: Visit the Eiffel Tower in the morning, then the Louvre Museum in the afternoon. Day 2: Explore the Montmartre district and see the Sacré-Cœur Basilica."

OUTPUT:
{
  "itinerary": {
    "destination": "Paris",
    "durationDays": 2,
    "dailyPlan": [
      { "day": 1, "title": "Iconic Landmarks", "activities": ["Morning: Visit the Eiffel Tower.", "Afternoon: Explore the Louvre Museum."] },
      { "day": 2, "title": "Artistic District", "activities": ["Explore the Montmartre district.", "Visit the Sacré-Cœur Basilica."] }
    ]
  }
}

### END OF EXAMPLES ###

Now, using the same format, convert the following unstructured ideas.

### UNSTRUCTURED IDEAS TO CONVERT ###
---
${unstructuredIdeas}
---
`;

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: structuringPrompt }] }],
        generationConfig: { temperature: 0.7 }, // Low temp for precision
    });
    return result.response.text();
}

/**
 * Main orchestrator function for generating a tailored travel itinerary.
 */
async function generateTravelItinerary(userPrompt, planType = DEFAULT_PLAN_TYPE) {
  if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
    throw new Error("Invalid userPrompt: Must be a non-empty string.");
  }

  try {
    // --- Step 1: Creative Brainstorming ---
    const unstructuredIdeas = await _generateItineraryIdeas(userPrompt, planType);
    
    // --- Step 2: Logical Structuring ---
    const jsonString = await _structureIdeasIntoJson(unstructuredIdeas);

    // --- Final Step: Parse and return the final object ---
    try {
        return JSON.parse(jsonString);
    } catch (parseError) {
        console.error("Error parsing final JSON:", jsonString);
        throw new Error("Failed to generate a valid JSON itinerary after structuring.");
    }
  } catch (apiError) {
    console.error("Error during the multi-step generation process:", apiError);
    throw new Error("Failed to generate content due to an API error in the chain.");
  }
}

module.exports = { generateTravelItinerary };
