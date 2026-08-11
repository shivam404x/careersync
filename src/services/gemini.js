import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const analyzeResume = async (resumeText) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
Analyze the following resume.

Return ONLY valid JSON.
Do NOT use markdown.
Do NOT wrap the response in \`\`\`json.

Resume:
${resumeText}

Return exactly this structure:

{
  "atsScore": 0,
  "summary": "",
  "technicalSkills": [],
  "softSkills": [],
  "missingSkills": [],
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "certifications": [],
  "projects": [],
  "jobRoles": [],
  "feedback": ""
}
`;

  const result = await model.generateContent(prompt);

  let text = result.response.text().trim();

  // Remove markdown if Gemini adds it
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("Gemini Response:", text);

  return JSON.parse(text);
};