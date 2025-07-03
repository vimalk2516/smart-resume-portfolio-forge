import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, Check, Sparkles, Globe } from 'lucide-react';
import type { ResumeData } from './ResumeBuilder';
import { geminiService } from '@/services/geminiService';

interface PortfolioGeneratorProps {
  data: ResumeData;
}

export const PortfolioGenerator: React.FC<PortfolioGeneratorProps> = ({ data }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [portfolioContent, setPortfolioContent] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePortfolio = async () => {
    setIsGenerating(true);
    try {
      const content = await geminiService.generatePortfolioContent(data);
      setPortfolioContent(content);
      
      // Generate a unique URL (in real implementation, this would be saved to a database)
      const randomId = Math.random().toString(36).substring(2, 8);
      const generatedUrl = `https://ai-resume-builder.vercel.app/portfolio/${randomId}`;
      setPortfolioUrl(generatedUrl);
    } catch (error) {
      console.error('Failed to generate portfolio:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPortfolioPreview = () => (
    <div className="bg-white border rounded-lg p-6 text-black min-h-96 space-y-6">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
        <h1 className="text-4xl font-bold mb-2">{data.personalInfo.fullName}</h1>
        <p className="text-xl opacity-90">Professional Portfolio</p>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <span>{data.personalInfo.email}</span>
          <span>•</span>
          <span>{data.personalInfo.location}</span>
        </div>
      </div>

      {/* About Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">About Me</h2>
        <p className="text-gray-700 leading-relaxed">
          {data.careerObjective || 'Passionate professional dedicated to excellence and innovation in technology.'}
        </p>
      </div>

      {/* Skills */}
      {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Skills & Expertise</h2>
          <div className="space-y-3">
            {data.skills.technical.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.technical.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Core Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills.soft.map((skill, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured Projects */}
      {data.projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Featured Projects</h2>
          <div className="grid gap-4">
            {data.projects.slice(0, 3).map((project, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-700 mb-3">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Highlights */}
      {data.experience.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Professional Experience</h2>
          <div className="space-y-4">
            {data.experience.slice(0, 2).map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900">{exp.role}</h3>
                <p className="text-blue-600 font-medium">{exp.company} • {exp.duration}</p>
                <p className="text-gray-700 mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Portfolio Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!portfolioUrl ? (
          <>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Create Your Portfolio Website</h3>
                <p className="text-muted-foreground">
                  Generate a beautiful, responsive portfolio website from your resume data.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
              <Input
                id="customDomain"
                placeholder="your-name (will create your-name.portfolio.com)"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
              />
            </div>

            <Button
              variant="hero"
              onClick={generatePortfolio}
              disabled={isGenerating}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating Portfolio...' : 'Generate Portfolio Website'}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">Portfolio Generated!</h4>
                  <p className="text-sm text-green-700">Your portfolio is ready to share</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Live
              </Badge>
            </div>

            <div className="space-y-2">
              <Label>Portfolio URL</Label>
              <div className="flex gap-2">
                <Input value={portfolioUrl} readOnly className="flex-1" />
                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Portfolio Preview</h4>
              {renderPortfolioPreview()}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPortfolioUrl('')} className="flex-1">
                Generate New
              </Button>
              <Button variant="gradient" className="flex-1" asChild>
                <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};