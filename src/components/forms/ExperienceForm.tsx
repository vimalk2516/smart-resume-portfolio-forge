import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, X, Sparkles } from 'lucide-react';
import type { ResumeData } from '../ResumeBuilder';

interface ExperienceFormProps {
  data: ResumeData;
  onDataUpdate: (data: Partial<ResumeData>) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onDataUpdate }) => {
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);

  const addExperience = () => {
    const newExperience = [...data.experience, { company: '', role: '', duration: '', description: '' }];
    onDataUpdate({ experience: newExperience });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = data.experience.map((exp, i) => 
      i === index ? { ...exp, [field]: value } : exp
    );
    onDataUpdate({ experience: newExperience });
  };

  const removeExperience = (index: number) => {
    const newExperience = data.experience.filter((_, i) => i !== index);
    onDataUpdate({ experience: newExperience });
  };

  const enhanceDescription = async (index: number) => {
    setEnhancingIndex(index);
    try {
      const { geminiService } = await import('@/services/geminiService');
      const experience = data.experience[index];
      const enhanced = await geminiService.enhanceJobDescription(
        experience.role,
        experience.company,
        experience.description
      );
      updateExperience(index, 'description', enhanced);
    } catch (error) {
      console.error('Failed to enhance description:', error);
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      {data.experience.map((exp, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Experience {index + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(index)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Company *</Label>
                <Input
                  placeholder="Company Name"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
              </div>
              <div>
                <Label>Role/Position *</Label>
                <Input
                  placeholder="Software Engineer"
                  value={exp.role}
                  onChange={(e) => updateExperience(index, 'role', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Duration</Label>
              <Input
                placeholder="Jan 2022 - Present"
                value={exp.duration}
                onChange={(e) => updateExperience(index, 'duration', e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Job Description</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => enhanceDescription(index)}
                  disabled={enhancingIndex === index}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {enhancingIndex === index ? 'Enhancing...' : 'Enhance with AI'}
                </Button>
              </div>
              <Textarea
                placeholder="Describe your responsibilities and achievements..."
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                className="min-h-20"
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button variant="outline" onClick={addExperience} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );
};