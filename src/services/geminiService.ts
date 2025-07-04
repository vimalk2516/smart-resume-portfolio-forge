// Main orchestrator service for backwards compatibility
import { resumeEnhancementService } from './resumeEnhancementService';
import { skillsService } from './skillsService';
import { resumeGenerationService } from './resumeGenerationService';
import { portfolioService } from './portfolioService';
import { chatBotService } from './chatBotService';

class GeminiService {
  // Resume Enhancement methods
  async enhanceCareerObjective(personalInfo: any, experience: any[], skills: any): Promise<string> {
    return resumeEnhancementService.enhanceCareerObjective(personalInfo, experience, skills);
  }

  async enhanceJobDescription(role: string, company: string, basicDescription: string): Promise<string> {
    return resumeEnhancementService.enhanceJobDescription(role, company, basicDescription);
  }

  async enhanceProjectDescription(title: string, currentDescription: string, technologies?: string[]): Promise<string> {
    return resumeEnhancementService.enhanceProjectDescription(title, currentDescription, technologies);
  }

  async enhanceCustomContent(content: string, sectionType: string, title: string): Promise<string> {
    return resumeEnhancementService.enhanceCustomContent(content, sectionType, title);
  }

  async comprehensiveResumeEnhancement(userInput: any): Promise<any> {
    return resumeEnhancementService.comprehensiveResumeEnhancement(userInput);
  }

  // Skills methods
  async suggestSkills(experienceData: any[], existingSkills: any): Promise<{ technical: string[], soft: string[] }> {
    return skillsService.suggestSkills(experienceData, existingSkills);
  }

  // Resume Generation methods
  async generateResumeFromPrompt(userPrompt: string): Promise<any> {
    return resumeGenerationService.generateResumeFromPrompt(userPrompt);
  }

  async parseResumeFromPDF(pdfText: string): Promise<any> {
    return resumeGenerationService.parseResumeFromPDF(pdfText);
  }

  // Portfolio methods
  async generatePortfolioContent(resumeData: any): Promise<string> {
    return portfolioService.generatePortfolioContent(resumeData);
  }

  // ChatBot methods
  async getChatBotResponse(userMessage: string, resumeData?: any): Promise<{ message: string, suggestion?: any }> {
    return chatBotService.getChatBotResponse(userMessage, resumeData);
  }
}

export const geminiService = new GeminiService();