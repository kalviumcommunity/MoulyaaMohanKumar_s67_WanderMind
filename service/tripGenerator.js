const genAI = require("../config/gemini");

async function generateResume(userPrompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Multi-shot prompt with a few examples
  const examples = `
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

EXAMPLE 1
User Details:
---
My name is John Doe. I’m a Software Engineer at Google since 2021. 
I specialize in JavaScript, React, and Node.js. 
I studied Computer Science at MIT and graduated in May 2019. 
I hold an AWS Certified Solutions Architect certificate.
---

Expected JSON:
{
  "name": "John Doe",
  "title": "Software Engineer",
  "summary": "Software Engineer with 3+ years of experience in building scalable web applications and cloud solutions. Skilled in modern JavaScript frameworks and backend systems.",
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Google",
      "dates": "2021 - Present",
      "responsibilities": ["Developed scalable web applications", "Optimized cloud solutions", "Collaborated with cross-functional teams"]
    }
  ],
  "education": [
    {
      "degree": "B.Sc. in Computer Science",
      "institution": "MIT",
      "graduation_date": "May 2019"
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuing_organization": "Amazon Web Services"
    }
  ]
}



`;

  try {
    const result = await model.generateContent(examples);
    const rawText = result.response.text();
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return cleanJson;
  } catch (err) {
    throw new Error("Error generating resume: " + err.message);
  }
}

module.exports = { generateResume };
