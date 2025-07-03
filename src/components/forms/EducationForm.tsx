import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import type { ResumeData } from '../ResumeBuilder';

interface EducationFormProps {
  data: ResumeData;
  onDataUpdate: (data: Partial<ResumeData>) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ data, onDataUpdate }) => {
  const addEducation = () => {
    const newEducation = [...data.education, { degree: '', college: '', year: '', grade: '' }];
    onDataUpdate({ education: newEducation });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = data.education.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    onDataUpdate({ education: newEducation });
  };

  const removeEducation = (index: number) => {
    const newEducation = data.education.filter((_, i) => i !== index);
    onDataUpdate({ education: newEducation });
  };

  return (
    <div className="space-y-4">
      {data.education.map((edu, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Education {index + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(index)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Degree/Course *</Label>
                <Input
                  placeholder="Bachelor of Science"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                />
              </div>
              <div>
                <Label>College/University *</Label>
                <Input
                  placeholder="University Name"
                  value={edu.college}
                  onChange={(e) => updateEducation(index, 'college', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Year of Graduation</Label>
                <Input
                  placeholder="2024"
                  value={edu.year}
                  onChange={(e) => updateEducation(index, 'year', e.target.value)}
                />
              </div>
              <div>
                <Label>Grade/GPA (Optional)</Label>
                <Input
                  placeholder="3.8 GPA"
                  value={edu.grade}
                  onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button variant="outline" onClick={addEducation} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Education
      </Button>
    </div>
  );
};