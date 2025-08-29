const genAI = require("../config/gemini");

async function generateResume(userPrompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


  const prompt = `
You are JobGenie, an expert AI-powered career assistant.
Your task is to generate a professional resume based ONLY on the user information provided.

You MUST adhere strictly to the following JSON format. Do not add, remove, or rename any fields from this structure.

The required JSON schema is:
{
  "name": "string",
  "title": "string",
  "summary": "A 2-3 sentence professional summary.",
  "skills": ["string"],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "dates": "string (e.g., 'January 2022 - Present')",
      "responsibilities": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "graduation_date": "string (e.g., 'May 2022')"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuing_organization": "string"
    }
  ]
}

User Details:
---
${userPrompt}
---

Based on the user details, populate the JSON object. If a specific field (like 'certifications') is not mentioned in the user details, return it as an empty array [] or an empty string "".
Your entire response must be ONLY the valid JSON object. Do not include any surrounding text, explanations, or markdown formatting like \`\`\`json.
`;


  try {
    const result = await model.generateContent(prompt);
    // Added a cleaning step to handle potential markdown wrappers, just in case.
    const rawText = result.response.text();
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return cleanJson;
  } catch (err) {
    throw new Error("Error generating resume: " + err.message);
  }
}

module.exports = { generateResume };