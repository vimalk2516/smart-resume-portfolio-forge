import { geminiClient } from './geminiClient';

class ResumeGenerationService {
  async generateResumeFromPrompt(userPrompt: string): Promise<any> {
    const prompt = `
Based on this user description, generate a complete resume data structure:

User Input: "${userPrompt}"

Create a comprehensive resume in JSON format with realistic but impressive details. Include:
- Personal information (generate realistic name, email, phone, location)
- Career objective
- Education (appropriate to their background)
- Experience (align with their stated experience level)
- Skills (technical and soft skills relevant to their field)
- Projects (2-3 relevant projects)
- Certifications (if applicable)
- Languages

Respond with valid JSON in this exact structure:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": ""
  },
  "careerObjective": "",
  "education": [{"degree": "", "college": "", "year": "", "grade": ""}],
  "experience": [{"company": "", "role": "", "duration": "", "description": ""}],
  "skills": {"technical": [], "soft": []},
  "projects": [{"title": "", "description": "", "technologies": []}],
  "certifications": [{"name": "", "issuer": "", "date": ""}],
  "languages": []
}

Make it professional, realistic, and tailored to their background.
`;

    const response = await geminiClient.makeRequest(prompt, { maxOutputTokens: 2048 });
    try {
      return JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      throw new Error('Failed to generate resume data');
    }
  }

  async parseResumeFromPDF(pdfText: string): Promise<any> {
    const prompt = `
Extract and structure the information from this resume text into a JSON format:

Resume Text:
${pdfText}

Parse this information and organize it into the following JSON structure:
{
  "personalInfo": {
    "fullName": "",
    "email": "",
    "phone": "",
    "location": ""
  },
  "careerObjective": "",
  "education": [{"degree": "", "college": "", "year": "", "grade": ""}],
  "experience": [{"company": "", "role": "", "duration": "", "description": ""}],
  "skills": {"technical": [], "soft": []},
  "projects": [{"title": "", "description": "", "technologies": []}],
  "certifications": [{"name": "", "issuer": "", "date": ""}],
  "languages": []
}

Extract all available information and organize it properly. If some fields are missing, leave them empty but include the structure.
`;

    const response = await geminiClient.makeRequest(prompt, { maxOutputTokens: 2048 });
    try {
      return JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
    } catch (error) {
      console.error('Failed to parse PDF content:', error);
      throw new Error('Failed to extract resume data');
    }
  }
}

export const resumeGenerationService = new ResumeGenerationService();