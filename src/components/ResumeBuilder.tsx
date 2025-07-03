import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Upload, Sparkles } from 'lucide-react';
import { StartMethodSelector } from './StartMethodSelector';
import { ResumeForm } from './ResumeForm';
import { ResumePreview } from './ResumePreview';
import { PortfolioGenerator } from './PortfolioGenerator';

export type StartMethod = 'scratch' | 'upload' | 'prompt';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  careerObjective: string;
  education: Array<{
    degree: string;
    college: string;
    year: string;
    grade?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    title: string;
    description: string;
    technologies?: string[];
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  languages: string[];
}

const ResumeBuilder = () => {
  const [startMethod, setStartMethod] = useState<StartMethod | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: ''
    },
    careerObjective: '',
    education: [],
    experience: [],
    skills: { technical: [], soft: [] },
    projects: [],
    certifications: [],
    languages: []
  });

  // Memory-based storage for resume data
  useEffect(() => {
    const savedData = localStorage.getItem('resumeBuilderData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setResumeData(parsed.resumeData || resumeData);
        setStartMethod(parsed.startMethod || null);
        setCurrentStep(parsed.currentStep || 0);
      } catch (error) {
        console.error('Failed to load saved resume data:', error);
      }
    }
  }, []);

  // Auto-save resume data
  useEffect(() => {
    const dataToSave = {
      resumeData,
      startMethod,
      currentStep,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('resumeBuilderData', JSON.stringify(dataToSave));
  }, [resumeData, startMethod, currentStep]);

  const handleStartMethodSelect = (method: StartMethod) => {
    setStartMethod(method);
    setCurrentStep(1);
  };

  const handleDataUpdate = (data: Partial<ResumeData>) => {
    setResumeData(prev => ({ ...prev, ...data }));
  };

  const renderStartMethod = () => {
    const methods = [
      {
        id: 'scratch' as StartMethod,
        title: 'Start from Scratch',
        description: 'Build your resume step by step with our guided form',
        icon: FileText,
        gradient: 'from-blue-500 to-indigo-600'
      },
      {
        id: 'upload' as StartMethod,
        title: 'Upload Existing Resume',
        description: 'Upload your PDF resume and let AI enhance it',
        icon: Upload,
        gradient: 'from-green-500 to-emerald-600'
      },
      {
        id: 'prompt' as StartMethod,
        title: 'AI-Generated Resume',
        description: 'Describe yourself and let AI create your resume',
        icon: Sparkles,
        gradient: 'from-purple-500 to-pink-600'
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-secondary to-background flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold gradient-hero bg-clip-text text-transparent mb-4">
              AI Resume Builder
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create professional resumes and portfolios with the power of AI. Choose how you'd like to get started.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {methods.map((method) => {
              const Icon = method.icon;
              return (
                <Card 
                  key={method.id}
                  className="relative overflow-hidden cursor-pointer group hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-2"
                  onClick={() => handleStartMethodSelect(method.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${method.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {method.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground mb-6">
                      {method.description}
                    </p>
                    <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors duration-300">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
              Powered by Google Gemini AI • Create professional resumes in minutes
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!startMethod) {
    return renderStartMethod();
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <StartMethodSelector 
              selectedMethod={startMethod}
              onMethodChange={setStartMethod}
            />
            <ResumeForm 
              method={startMethod}
              data={resumeData}
              onDataUpdate={handleDataUpdate}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
            />
            
            {/* Portfolio Generator - Show only when resume has substantial content */}
            {(resumeData.personalInfo.fullName && 
              (resumeData.experience.length > 0 || resumeData.projects.length > 0)) && (
              <PortfolioGenerator data={resumeData} />
            )}
          </div>
          
          {/* Preview Section */}
          <div className="lg:sticky lg:top-8">
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;