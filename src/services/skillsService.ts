import { geminiClient } from './geminiClient';

class SkillsService {
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

    const response = await geminiClient.makeRequest(prompt);
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
}

export const skillsService = new SkillsService();