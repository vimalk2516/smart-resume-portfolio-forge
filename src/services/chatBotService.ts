import { geminiClient } from './geminiClient';

class ChatBotService {
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

    const response = await geminiClient.makeRequest(prompt);
    
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

export const chatBotService = new ChatBotService();