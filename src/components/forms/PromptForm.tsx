import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Lightbulb } from 'lucide-react';
import type { ResumeData } from '../ResumeBuilder';

interface PromptFormProps {
  onDataUpdate: (data: Partial<ResumeData>) => void;
}

const prompts = [
  "I'm a software engineer with 3 years of experience in React and Node.js, looking for a senior developer role",
  "Recent computer science graduate with internship experience, seeking entry-level position in web development",
  "Marketing professional with 5 years experience in digital campaigns and social media management",
  "Data analyst with expertise in Python, SQL, and machine learning, transitioning to data science role"
];

export const PromptForm: React.FC<PromptFormProps> = ({ onDataUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFromPrompt = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Import the gemini service dynamically to avoid build issues
      const { geminiService } = await import('@/services/geminiService');
      const generatedData = await geminiService.generateResumeFromPrompt(prompt);
      onDataUpdate(generatedData);
    } catch (error) {
      console.error('Failed to generate resume:', error);
      // Fallback to mock data
      const mockData: Partial<ResumeData> = {
        personalInfo: {
          fullName: 'AI Generated User',
          email: 'user@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA'
        },
        careerObjective: generateCareerObjective(prompt),
        education: [{
          degree: 'Bachelor of Computer Science',
          college: 'Tech University',
          year: '2021'
        }],
        experience: generateExperience(prompt),
        skills: generateSkills(prompt),
        projects: generateProjects(prompt)
      };
      onDataUpdate(mockData);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCareerObjective = (prompt: string): string => {
    if (prompt.includes('software engineer')) {
      return 'Passionate software engineer with expertise in modern web technologies, seeking to leverage technical skills and collaborative mindset to drive innovation in a senior development role.';
    }
    if (prompt.includes('graduate')) {
      return 'Recent computer science graduate with strong foundation in programming and eagerness to contribute to dynamic development teams while continuing to grow technical expertise.';
    }
    return 'Dedicated professional seeking to apply skills and experience in a challenging role that offers growth opportunities and meaningful impact.';
  };

  const generateExperience = (prompt: string) => {
    if (prompt.includes('3 years')) {
      return [{
        company: 'Tech Solutions Inc.',
        role: 'Software Engineer',
        duration: '2021 - Present',
        description: 'Developed and maintained web applications using React and Node.js, collaborated with cross-functional teams, and improved system performance by 30%.'
      }];
    }
    return [{
      company: 'StartupXYZ',
      role: 'Software Development Intern',
      duration: 'Summer 2023',
      description: 'Contributed to front-end development projects, learned modern development practices, and supported senior developers in code reviews.'
    }];
  };

  const generateSkills = (prompt: string) => {
    if (prompt.includes('React') && prompt.includes('Node.js')) {
      return {
        technical: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'Git'],
        soft: ['Problem Solving', 'Team Collaboration', 'Communication', 'Adaptability']
      };
    }
    return {
      technical: ['JavaScript', 'HTML', 'CSS', 'Python', 'Git'],
      soft: ['Quick Learning', 'Attention to Detail', 'Communication']
    };
  };

  const generateProjects = (prompt: string) => {
    return [{
      title: 'E-commerce Web Application',
      description: 'Built a full-stack e-commerce platform with user authentication, product catalog, and payment integration.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API']
    }];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          AI-Generated Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Describe yourself and your career goals
          </label>
          <Textarea
            placeholder="Tell AI about your background, experience, skills, and what kind of role you're seeking..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-32"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Lightbulb className="w-4 h-4" />
            Example prompts:
          </div>
          <div className="grid gap-2">
            {prompts.map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className="text-left p-3 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="hero"
          onClick={generateFromPrompt}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isGenerating ? 'Generating Resume...' : 'Generate Resume with AI'}
        </Button>

        {isGenerating && (
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">
              AI is analyzing your information and creating your resume...
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};