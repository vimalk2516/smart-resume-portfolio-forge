import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Sparkles } from 'lucide-react';
import type { StartMethod, ResumeData } from './ResumeBuilder';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { EducationForm } from './forms/EducationForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { SkillsForm } from './forms/SkillsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { CertificationsForm } from './forms/CertificationsForm';
import { CustomOptionsForm } from './forms/CustomOptionsForm';
import { UploadForm } from './forms/UploadForm';
import { PromptForm } from './forms/PromptForm';

interface ResumeFormProps {
  method: StartMethod;
  data: ResumeData;
  onDataUpdate: (data: Partial<ResumeData>) => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

const steps = [
  { id: 'personal', title: 'Personal Info', component: PersonalInfoForm, required: true },
  { id: 'objective', title: 'Career Objective', component: null, required: false },
  { id: 'education', title: 'Education', component: EducationForm, required: true },
  { id: 'experience', title: 'Experience', component: ExperienceForm, required: false },
  { id: 'skills', title: 'Skills', component: SkillsForm, required: true },
  { id: 'projects', title: 'Projects', component: ProjectsForm, required: false },
  { id: 'certifications', title: 'Certifications', component: CertificationsForm, required: false },
  { id: 'custom', title: 'Custom Sections', component: CustomOptionsForm, required: false },
  { id: 'languages', title: 'Languages', component: null, required: false },
];

export const ResumeForm: React.FC<ResumeFormProps> = ({
  method,
  data,
  onDataUpdate,
  currentStep,
  onStepChange
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  if (method === 'upload') {
    return <UploadForm onDataUpdate={onDataUpdate} />;
  }

  if (method === 'prompt') {
    return <PromptForm onDataUpdate={onDataUpdate} />;
  }

  const currentStepData = steps[currentStep - 1];
  const StepComponent = currentStepData?.component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      onStepChange(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  const handleEnhanceWithAI = async () => {
    setIsEnhancing(true);
    try {
      const { geminiService } = await import('@/services/geminiService');
      const enhanced = await geminiService.enhanceCareerObjective(
        data.personalInfo, 
        data.experience, 
        data.skills
      );
      onDataUpdate({ careerObjective: enhanced });
    } catch (error) {
      console.error('Failed to enhance career objective:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const renderCareerObjective = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="objective">Career Objective</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEnhanceWithAI}
          disabled={isEnhancing}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
        </Button>
      </div>
      <Textarea
        id="objective"
        placeholder="Write a brief career objective or let AI generate one based on your profile..."
        value={data.careerObjective}
        onChange={(e) => onDataUpdate({ careerObjective: e.target.value })}
        className="min-h-24"
      />
    </div>
  );

  const renderLanguages = () => (
    <div className="space-y-4">
      <Label>Languages Known</Label>
      <div className="flex flex-wrap gap-2 mb-3">
        {data.languages.map((language, index) => (
          <Badge key={index} variant="secondary" className="gap-1">
            {language}
            <X 
              className="w-3 h-3 cursor-pointer hover:text-destructive" 
              onClick={() => {
                const newLanguages = data.languages.filter((_, i) => i !== index);
                onDataUpdate({ languages: newLanguages });
              }}
            />
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Add a language"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              const newLanguages = [...data.languages, e.currentTarget.value.trim()];
              onDataUpdate({ languages: newLanguages });
              e.currentTarget.value = '';
            }
          }}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
            if (input.value.trim()) {
              const newLanguages = [...data.languages, input.value.trim()];
              onDataUpdate({ languages: newLanguages });
              input.value = '';
            }
          }}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {currentStepData?.title}
              {currentStepData?.required && <span className="text-destructive">*</span>}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {currentStepData?.required ? 'Required section' : 'Optional - but recommended'}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>
        </div>
        
        {/* Step Navigation Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => onStepChange(index + 1)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs transition-colors ${
                index + 1 === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index + 1 < currentStep
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {index + 1}. {step.title}
              {step.required && <span className="ml-1">*</span>}
            </button>
          ))}
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {StepComponent && (
          <StepComponent data={data} onDataUpdate={onDataUpdate} />
        )}
        
        {currentStepData?.id === 'objective' && renderCareerObjective()}
        {currentStepData?.id === 'languages' && renderLanguages()}

        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={currentStep === steps.length}
          >
            {currentStep === steps.length ? 'Complete' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};