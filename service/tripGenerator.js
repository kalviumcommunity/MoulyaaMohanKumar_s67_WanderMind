const genAI = require("../config/gemini");

async function generateResume(userPrompt, resumeType = 'general') {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.2, // Kept it low for structured output
    },
  });

  // --- DYNAMIC PROMPTING IMPLEMENTATION ---
  // 1. A map of specific instructions for different resume types.
  const dynamicInstructions = {
    'software-engineer': `
Special Focus: Emphasize the candidate's technical skills, GitHub profile, and quantifiable project achievements (e.g., 'reduced latency by 20%'). Use strong, technical action verbs like 'developed', 'architected', 'implemented', and 'optimized'.`,
    'marketing-manager': `
Special Focus: Highlight metrics and KPIs (e.g., 'increased lead generation by 35%', 'managed a $50k budget'). Focus on strategic achievements in SEO, SEM, and campaign management. Use business-oriented verbs like 'drove', 'managed', 'analyzed', and 'strategized'.`,
    'recent-graduate': `
Special Focus: Emphasize internships, academic projects, relevant coursework, and extracurriculars. Highlight potential, eagerness to learn, and transferable skills. Frame experience in terms of skills learned and applied.`,
    'general': `
Special Focus: Create a balanced and professional resume suitable for a general corporate role.`
  };

  // 2. Select the appropriate instruction set, defaulting to 'general'.
  const selectedInstruction = dynamicInstructions[resumeType] || dynamicInstructions['general'];

  // 3. The system prompt is now dynamic and includes the selected instructions.
  const systemPrompt = `
You are JobGenie, an AI-powered professional resume writer.
Your goal: Convert the given user details into a well-structured, ATS-friendly resume in JSON format.

${selectedInstruction}

Rules:
1. Keep JSON keys in camelCase.
2. Ensure correct grammar and formatting.
3. Only return valid JSON, no extra text.
`;

  const prompt = `${systemPrompt}\n\nUser Data:\n${userPrompt}`;

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