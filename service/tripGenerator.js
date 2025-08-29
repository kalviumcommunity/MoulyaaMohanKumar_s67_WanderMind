const genAI = require("../config/gemini");

async function generateResume(userPrompt) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    // --- CORRECTED CONFIGURATION ---
    // Settings are now optimized for predictable, structured output.
    generationConfig: {
      temperature: 0.1, // Low temperature reduces randomness.
      // topP and topK are removed as they are not needed and conflict.
    },
  });

  // System Prompt
  const systemPrompt = `
You are JobGenie, an AI-powered professional resume writer.
Your goal: Convert the given user details into a well-structured, ATS-friendly resume in JSON format.
Rules:
1. Keep JSON keys in camelCase.
2. Ensure correct grammar and formatting.
3. Do not include unnecessary commentary or explanations in the output.
4. Only return valid JSON, no extra text.
`;

  const prompt = `${systemPrompt}\n\nUser Data:\n${userPrompt}`;

  // Re-added try...catch for robust error handling
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw new Error("Failed to generate content from the API.");
  }
}

module.exports = { generateResume };