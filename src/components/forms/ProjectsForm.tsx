import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, X, Sparkles } from 'lucide-react';
import type { ResumeData } from '../ResumeBuilder';

interface ProjectsFormProps {
  data: ResumeData;
  onDataUpdate: (data: Partial<ResumeData>) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onDataUpdate }) => {
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);

  const addProject = () => {
    const newProjects = [...data.projects, { title: '', description: '', technologies: [] }];
    onDataUpdate({ projects: newProjects });
  };

  const updateProject = (index: number, field: string, value: string | string[]) => {
    const newProjects = data.projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    );
    onDataUpdate({ projects: newProjects });
  };

  const removeProject = (index: number) => {
    const newProjects = data.projects.filter((_, i) => i !== index);
    onDataUpdate({ projects: newProjects });
  };

  const addTechnology = (projectIndex: number, tech: string) => {
    if (!tech.trim()) return;
    
    const project = data.projects[projectIndex];
    const technologies = project.technologies || [];
    updateProject(projectIndex, 'technologies', [...technologies, tech.trim()]);
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const project = data.projects[projectIndex];
    const technologies = project.technologies || [];
    updateProject(projectIndex, 'technologies', technologies.filter((_, i) => i !== techIndex));
  };

  const enhanceDescription = async (index: number) => {
    setEnhancingIndex(index);
    try {
      const { geminiService } = await import('@/services/geminiService');
      const project = data.projects[index];
      const enhanced = await geminiService.enhanceProjectDescription(
        project.title,
        project.description,
        project.technologies
      );
      updateProject(index, 'description', enhanced);
    } catch (error) {
      console.error('Failed to enhance description:', error);
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-4">
      {data.projects.map((project, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Project {index + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(index)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Project Title *</Label>
              <Input
                placeholder="E-commerce Website"
                value={project.title}
                onChange={(e) => updateProject(index, 'title', e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Project Description</Label>
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
                placeholder="Describe your project, its features, and your role..."
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                className="min-h-20"
              />
            </div>

            <div>
              <Label>Technologies Used</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {(project.technologies || []).map((tech, techIndex) => (
                  <Badge key={techIndex} variant="secondary" className="gap-1">
                    {tech}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeTechnology(index, techIndex)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add technology (e.g., React, Node.js)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      addTechnology(index, e.currentTarget.value);
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
                      addTechnology(index, input.value);
                      input.value = '';
                    }
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button variant="outline" onClick={addProject} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Project
      </Button>
    </div>
  );
};