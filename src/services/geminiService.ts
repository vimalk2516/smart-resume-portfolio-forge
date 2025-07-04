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
    const experienceLevel = this.determineExperienceLevel(experience);
    const primarySkills = skills.technical.slice(0, 5).join(', ');
    const industryFocus = this.detectIndustryFocus(experience, skills);
    
    const prompt = `
You are an expert career counselor. Create a compelling, ATS-optimized career objective that will grab recruiters' attention.

CANDIDATE PROFILE:
- Name: ${personalInfo.fullName}
- Experience Level: ${experienceLevel}
- Location: ${personalInfo.location}
- Industry Focus: ${industryFocus}

PROFESSIONAL EXPERIENCE:
${experience.map(exp => `• ${exp.role} at ${exp.company} (${exp.duration})
  Achievements: ${exp.description}`).join('\n')}

CORE COMPETENCIES:
Technical Skills: ${primarySkills}
Leadership/Soft Skills: ${skills.soft.join(', ')}

INSTRUCTIONS:
1. Write a powerful 2-3 sentence career objective
2. Start with their experience level and strongest skills
3. Mention specific industry/role targets
4. Include quantifiable impact language
5. Use action-oriented, confident tone
6. Make it ATS-friendly with relevant keywords
7. Align with current job market trends

Focus on what they can DELIVER to employers, not what they want to receive.
`;

    return this.makeRequest(prompt);
  }

  private determineExperienceLevel(experience: any[]): string {
    const totalYears = experience.reduce((acc, exp) => {
      const duration = exp.duration.toLowerCase();
      if (duration.includes('year')) {
        const match = duration.match(/(\d+)\s*year/);
        return acc + (match ? parseInt(match[1]) : 1);
      }
      return acc + 0.5; // Assume 6 months for non-specific durations
    }, 0);

    if (totalYears < 1) return 'Entry-level professional';
    if (totalYears < 3) return 'Junior-level professional';
    if (totalYears < 6) return 'Mid-level professional';
    if (totalYears < 10) return 'Senior professional';
    return 'Executive-level professional';
  }

  private detectIndustryFocus(experience: any[], skills: any): string {
    const techSkills = skills.technical.join(' ').toLowerCase();
    const expText = experience.map(e => `${e.role} ${e.description}`).join(' ').toLowerCase();
    
    if (techSkills.includes('react') || techSkills.includes('frontend') || techSkills.includes('javascript')) {
      return 'Frontend Development';
    }
    if (techSkills.includes('backend') || techSkills.includes('api') || techSkills.includes('server')) {
      return 'Backend Development';
    }
    if (techSkills.includes('data') || techSkills.includes('python') || techSkills.includes('sql')) {
      return 'Data Science/Analytics';
    }
    if (expText.includes('marketing') || expText.includes('campaign')) {
      return 'Digital Marketing';
    }
    return 'Technology';
  }

  async enhanceJobDescription(role: string, company: string, basicDescription: string): Promise<string> {
    const prompt = `
You are an expert resume writer and career coach. Transform this job description into a compelling, ATS-optimized resume entry.

ROLE DETAILS:
Position: ${role}
Company: ${company}
Current Description: ${basicDescription}

ENHANCEMENT REQUIREMENTS:
1. Start each bullet with powerful action verbs (Led, Developed, Implemented, Optimized)
2. Quantify achievements with realistic metrics (increase %, cost savings, team size)
3. Use industry-relevant keywords for ATS optimization
4. Highlight both technical skills and business impact
5. Focus on outcomes and results, not just responsibilities
6. Keep each bullet to 1-2 lines maximum
7. Use present tense for current roles, past tense for previous roles

STRUCTURE: Return 3-4 bullet points that showcase:
• Technical/core competencies used
• Quantifiable achievements and impact
• Leadership or collaboration aspects
• Process improvements or innovations

Make this role sound impressive while remaining truthful and professional.
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

  async suggestSkills(experienceData: any[], existingSkills: any): Promise<{ technical: string[], soft: string[] }> {
    const currentYear = new Date().getFullYear();
    const experienceText = experienceData.map(exp => `${exp.role}: ${exp.description}`).join(' ');
    const currentTech = existingSkills.technical.join(', ');
    const currentSoft = existingSkills.soft.join(', ');
    
    const prompt = `
You are a tech recruitment expert and skills advisor. Analyze this professional profile and suggest highly relevant, in-demand skills.

CURRENT PROFILE:
Experience Summary: ${experienceText}
Existing Technical Skills: ${currentTech}
Existing Soft Skills: ${currentSoft}

ANALYSIS REQUIREMENTS:
1. Identify the primary career track/domain
2. Research current ${currentYear} job market trends for this field
3. Suggest complementary skills that enhance marketability
4. Focus on skills that pair well with existing competencies
5. Include emerging technologies and methodologies
6. Avoid duplicating existing skills

SKILL CATEGORIES TO CONSIDER:
Technical: Frameworks, tools, platforms, methodologies relevant to their domain
Soft: Leadership, communication, project management skills valued by employers

Return JSON format:
{
  "technical": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "soft": ["skill1", "skill2", "skill3", "skill4", "skill5"]
}

Prioritize skills that:
- Are frequently requested in job postings
- Complement their existing skill set
- Match current industry trends
- Improve their promotion/salary potential
`;

    const response = await this.makeRequest(prompt);
    try {
      const suggestions = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
      // Filter out existing skills
      return {
        technical: suggestions.technical.filter(skill => 
          !existingSkills.technical.some(existing => 
            existing.toLowerCase() === skill.toLowerCase()
          )
        ),
        soft: suggestions.soft.filter(skill => 
          !existingSkills.soft.some(existing => 
            existing.toLowerCase() === skill.toLowerCase()
          )
        )
      };
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

  async enhanceCustomContent(content: string, sectionType: string, title: string): Promise<string> {
    const prompt = `
Enhance this resume section content for maximum professional impact:

Section Type: ${sectionType}
Section Title: ${title}
Current Content: ${content}

Instructions:
1. Make it more professional and compelling
2. Use action verbs and quantifiable achievements
3. Optimize for ATS systems
4. Keep the tone consistent with professional resume standards
5. Maintain the original intent but enhance clarity and impact

Return only the enhanced content, no additional formatting.
`;

    return this.makeRequest(prompt);
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

  async getChatBotResponse(userMessage: string, resumeData?: any): Promise<{ message: string, suggestion?: any }> {
    const contextInfo = resumeData ? `\n\nCURRENT RESUME DATA:\n${JSON.stringify(resumeData, null, 2)}` : '';
    
    const prompt = `
You are an expert resume and career advisor AI assistant. Help users with resume building, career advice, and professional development.

USER QUESTION: ${userMessage}${contextInfo}

INSTRUCTIONS:
1. Provide helpful, actionable advice
2. Be conversational and encouraging
3. If asked about specific resume sections, give detailed guidance
4. If the user's resume data is provided, give personalized suggestions
5. For technical questions, provide current industry best practices
6. Keep responses concise but informative (under 300 words)
7. If you can suggest specific improvements to their resume, format them as actionable suggestions

COMMON TOPICS TO HELP WITH:
- Resume writing best practices
- ATS optimization
- Industry-specific advice
- Career objective writing
- Skills selection and presentation
- Project descriptions
- Experience formatting
- Portfolio creation
- Interview preparation
- Job search strategies

RESPONSE FORMAT:
Provide a helpful response. If you have specific suggestions for their resume content, mention them naturally in your response.
`;

    const response = await this.makeRequest(prompt);
    
    // Check if the response contains actionable suggestions
    const hasSuggestions = response.toLowerCase().includes('suggest') || 
                          response.toLowerCase().includes('recommend') ||
                          response.toLowerCase().includes('add') ||
                          response.toLowerCase().includes('improve');
    
    return {
      message: response,
      suggestion: hasSuggestions ? { type: 'general', content: response } : undefined
    };
  }
}

export const geminiService = new GeminiService();