const genAI = require("../config/gemini");

// --- Constants and DYNAMIC_INSTRUCTIONS remain the same ---
const MODEL_NAME = "gemini-1.5-flash";
const DEFAULT_PLAN_TYPE = 'general';
const DYNAMIC_INSTRUCTIONS = { /* ... (no changes here) ... */ };
const _generateItineraryIdeas = async (userPrompt, planType) => { /* ... (no changes here) ... */ };

/**
 * STEP 2: Structure the brainstormed ideas into a clean JSON object using FEW-SHOT examples.
 * @param {string} unstructuredIdeas The text generated from the brainstorming step.
 * @returns {Promise<string>} A promise that resolves to a stringified JSON object.
 */
async function _structureIdeasIntoJson(unstructuredIdeas) {
    // --- NEW: The prompt is updated to include a few-shot examples section ---
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
      {
        "day": 1,
        "title": "Iconic Landmarks",
        "activities": ["Morning: Visit the Eiffel Tower.", "Afternoon: Explore the Louvre Museum."]
      },
      {
        "day": 2,
        "title": "Artistic District",
        "activities": ["Explore the Montmartre district.", "Visit the Sacré-Cœur Basilica."]
      }
    ]
  }
}

INPUT:
"A weekend food tour in Rome. Day 1 should be a pizza-making class and a visit to the Colosseum. Day 2, a pasta-making class and a walk through the Trastevere neighborhood."

OUTPUT:
{
  "itinerary": {
    "destination": "Rome",
    "durationDays": 2,
    "dailyPlan": [
      {
        "day": 1,
        "title": "Pizza & History",
        "activities": ["Attend a traditional pizza-making class.", "Explore the ancient Colosseum."]
      },
      {
        "day": 2,
        "title": "Pasta & Charm",
        "activities": ["Participate in a fresh pasta-making class.", "Take a walk through the Trastevere neighborhood."]
      }
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
    
    const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        generationConfig: { temperature: 0.1 }, // Low temp for precision
    });
    const result = await model.generateContent(structuringPrompt);
    return result.response.text();
}

/**
 * The main orchestrator function remains the same.
 */
async function generateTravelItinerary(userPrompt, planType = DEFAULT_PLAN_TYPE) {
    // ... (no changes in this function's logic) ...
    try {
        const unstructuredIdeas = await _generateItineraryIdeas(userPrompt, planType);
        const jsonString = await _structureIdeasIntoJson(unstructuredIdeas);
        return JSON.parse(jsonString);
    } catch (error) {
        // ... error handling ...
    }
}

module.exports = { generateTravelItinerary };
