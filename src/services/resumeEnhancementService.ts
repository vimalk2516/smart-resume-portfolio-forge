import { geminiClient } from './geminiClient';

class ResumeEnhancementService {
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

    return geminiClient.makeRequest(prompt);
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

    return geminiClient.makeRequest(prompt);
  }

  async enhanceProjectDescription(title: string, currentDescription: string, technologies?: string[]): Promise<string> {
    const prompt = `
Enhance this project description for a resume:

Project: ${title}
Current Description: ${currentDescription}
Technologies: ${technologies?.join(', ') || 'Not specified'}

Rewrite this to be more professional and highlight technical achievements. Focus on what was built, the impact, and technical challenges overcome. Use action verbs and make it sound impressive while remaining truthful. Keep it 2-3 sentences.
`;

    return geminiClient.makeRequest(prompt);
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

    return geminiClient.makeRequest(prompt);
  }

  async comprehensiveResumeEnhancement(userInput: any): Promise<any> {
    const prompt = `
You are a professional AI assistant trained for resume and portfolio creation. Your job is to:

🎯 Fix inaccurate, low-quality, or broken data (e.g., poorly extracted from PDFs)  
🎯 Convert raw or incomplete input into a polished, ATS-friendly resume  
🎯 Optimize content tone, structure, and language  
🎯 Make each section relevant, specific, and concise  
🎯 Generate a clean, SEO-optimized **Portfolio Intro**  
🎯 Ensure shareable-ready output for web and PDF export

Based on the structured input, return:

{
  "careerSummary": "Short, crisp and job-focused summary",
  "fixedSkills": ["Expanded and relevant skills"],
  "projectDescriptions": ["Optimized in action-result format"],
  "experienceDescriptions": ["Enhanced with impact and clarity"],
  "portfolioIntro": "SEO-optimized professional intro",
  "fixedResumeBody": "Full resume content block with formatting ready for export",
  "shareableSlug": "auto-generate a clean title for a public portfolio/resume link"
}

🎯 Guidelines:
- Rewrite broken or improperly extracted sentences clearly
- Prioritize **relevance, impact, and correctness**
- Avoid vague or repetitive phrases
- Enhance clarity with strong action verbs
- Generate smart suggestions if data is weak or incomplete

📝 Here is the raw user input (from upload, text, or manual entry):

${JSON.stringify(userInput, null, 2)}

Respond with valid JSON only, no additional text or formatting.
`;

    const response = await geminiClient.makeRequest(prompt, { maxOutputTokens: 2048 });
    try {
      return JSON.parse(response.replace(/```json\n?|\n?```/g, ''));
    } catch (error) {
      console.error('Failed to parse comprehensive enhancement response:', error);
      throw new Error('Failed to enhance resume data');
    }
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
}

export const resumeEnhancementService = new ResumeEnhancementService();