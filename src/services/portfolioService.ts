import { geminiClient } from './geminiClient';

class PortfolioService {
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

    return geminiClient.makeRequest(prompt, { maxOutputTokens: 2048 });
  }
}

export const portfolioService = new PortfolioService();