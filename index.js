// To use environment variables for your API key
require("dotenv").config();

const { generateResume } = require("./services/resumeGenerator");

// User details provided as a clear string
const userPrompt = `
Name: Vijay Kumar
Title: Full Stack Developer
Summary: Passionate developer with 3+ years of experience in building scalable web applications.
Skills: JavaScript, React, Node.js, MongoDB, Express
Experience:
- Job Title: Software Engineer, Company: TechCorp, Dates: 2022 - 2025
- Job Title: Intern, Company: WebWorld, Dates: 2021
Education: B.Tech in Computer Science from a reputable university
Certifications: Name: AWS Certified Developer, Organization: Amazon Web Services
`;

// Call the function and handle the response
generateResume(userPrompt)
  .then((resumeJson) => {
    // We parse the JSON string to work with it as an object
    const resume = JSON.parse(resumeJson);
    console.log("✅ Resume Generated Successfully!");
    console.log(JSON.stringify(resume, null, 2)); // Pretty-print the JSON
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });