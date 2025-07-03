import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Sparkles } from 'lucide-react';
import type { ResumeData } from '../ResumeBuilder';

interface SkillsFormProps {
  data: ResumeData;
  onDataUpdate: (data: Partial<ResumeData>) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onDataUpdate }) => {
  const addSkill = (type: 'technical' | 'soft', skill: string) => {
    if (!skill.trim()) return;
    
    const newSkills = {
      ...data.skills,
      [type]: [...data.skills[type], skill.trim()]
    };
    onDataUpdate({ skills: newSkills });
  };

  const removeSkill = (type: 'technical' | 'soft', index: number) => {
    const newSkills = {
      ...data.skills,
      [type]: data.skills[type].filter((_, i) => i !== index)
    };
    onDataUpdate({ skills: newSkills });
  };

  const suggestSkills = async () => {
    try {
      const { geminiService } = await import('@/services/geminiService');
      const suggestions = await geminiService.suggestSkills(data.experience, data.skills);
      
      // Merge suggestions with existing skills
      const newSkills = {
        technical: [...new Set([...data.skills.technical, ...suggestions.technical])],
        soft: [...new Set([...data.skills.soft, ...suggestions.soft])]
      };
      
      onDataUpdate({ skills: newSkills });
    } catch (error) {
      console.error('Failed to suggest skills:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Technical Skills */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label>Technical Skills</Label>
          <Button variant="outline" size="sm" onClick={suggestSkills}>
            <Sparkles className="w-4 h-4 mr-2" />
            Suggest Skills
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.skills.technical.map((skill, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {skill}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeSkill('technical', index)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add technical skill (e.g., React, Python, SQL)"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                addSkill('technical', e.currentTarget.value);
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
                addSkill('technical', input.value);
                input.value = '';
              }
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Soft Skills */}
      <div className="space-y-3">
        <Label>Soft Skills</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {data.skills.soft.map((skill, index) => (
            <Badge key={index} variant="outline" className="gap-1">
              {skill}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeSkill('soft', index)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add soft skill (e.g., Leadership, Communication)"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                addSkill('soft', e.currentTarget.value);
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
                addSkill('soft', input.value);
                input.value = '';
              }
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};