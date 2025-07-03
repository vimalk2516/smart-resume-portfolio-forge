const GEMINI_API_KEY = 'AIzaSyCGNfzPnoylWkWtWeDgpdr6noXJ0BJgiww';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

class GeminiService {
  private async makeRequest(prompt: string, config?: any): Promise<string> {
    const request: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
        ...config
      }
    };

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || '';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate content with AI');
    }
  }

  async enhanceCareerObjective(personalInfo: any, experience: any[], skills: any): Promise<string> {
    const prompt = `
Create a professional career objective for a resume based on this information:

Personal Info:
- Name: ${personalInfo.fullName}
- Email: ${personalInfo.email}
- Location: ${personalInfo.location}

Experience:
${experience.map(exp => `- ${exp.role} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}

Skills:
Technical: ${skills.technical.join(', ')}
Soft: ${skills.soft.join(', ')}

Write a concise, professional career objective (2-3 sentences) that highlights their strengths and career goals. Make it specific to their background and aspirations.
`;

    return this.makeRequest(prompt);
  }

  async enhanceJobDescription(role: string, company: string, basicDescription: string): Promise<string> {
    const prompt = `
Enhance this job description for a resume:

Role: ${role}
Company: ${company}
Current Description: ${basicDescription}

Rewrite this to be more professional and impactful. Use action verbs, quantify achievements where possible (you can add reasonable estimates), and highlight key responsibilities and accomplishments. Keep it concise but compelling (3-4 bullet points or sentences).
`;

    return this.makeRequest(prompt);
  }

  async enhanceProjectDescription(title: string, currentDescription: string, technologies?: string[]): Promise<string> {
    const prompt = `
Enhance this project description for a resume:

Project: ${title}
Current Description: ${currentDescription}
Technologies: ${technologies?.join(', ') || 'Not specified'}

Rewrite this to be more professional and highlight technical achievements. Focus on what was built, the impact, and technical challenges overcome. Use action verbs and make it sound impressive while remaining truthful. Keep it 2-3 sentences.
`;

    return this.makeRequest(prompt);
  }

  async suggestSkills(role: string, experience: any[]): Promise<{ technical: string[], soft: string[] }> {
    const prompt = `
Based on this career information, suggest additional relevant skills:

Target Role: ${role}
Experience:
${experience.map(exp => `- ${exp.role} at ${exp.company}: ${exp.description}`).join('\n')}

Provide a JSON response with suggested skills in this format:
{
  "technical": ["skill1", "skill2", "skill3"],
  "soft": ["skill1", "skill2", "skill3"]
}

Focus on skills that are commonly required for this role and align with their experience. Limit to 5 skills per category.
`;

    const response = await this.makeRequest(prompt);
    try {
      return JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
    } catch {
      return { technical: [], soft: [] };
    }
  }

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

    const response = await this.makeRequest(prompt, { maxOutputTokens: 2048 });
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

    const response = await this.makeRequest(prompt, { maxOutputTokens: 2048 });
    try {
      return JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
    } catch (error) {
      console.error('Failed to parse PDF content:', error);
      throw new Error('Failed to extract resume data');
    }
  }

  async generatePortfolioContent(resumeData: any): Promise<string> {
    const prompt = `
Create an engaging portfolio introduction and summary based on this resume data:

${JSON.stringify(resumeData, null, 2)}

Write a compelling portfolio page content that includes:
1. A professional hero section introduction
2. About me summary
3. Skills overview
4. Featured projects descriptions
5. Professional experience highlights

Make it engaging, professional, and SEO-optimized. Use HTML structure with appropriate headings and sections.
`;

    return this.makeRequest(prompt, { maxOutputTokens: 2048 });
  }
}

export const geminiService = new GeminiService();