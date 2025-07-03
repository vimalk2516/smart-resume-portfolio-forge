import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Settings, Sparkles } from 'lucide-react';
import type { ResumeData } from '../ResumeBuilder';

interface CustomOptionsFormProps {
  data: ResumeData & { customSections?: Array<{ title: string; content: string; type: string }> };
  onDataUpdate: (data: any) => void;
}

const sectionTypes = [
  { value: 'text', label: 'Text Section' },
  { value: 'list', label: 'Bullet Points' },
  { value: 'achievements', label: 'Achievements' },
  { value: 'awards', label: 'Awards & Honors' },
  { value: 'publications', label: 'Publications' },
  { value: 'volunteer', label: 'Volunteer Work' },
  { value: 'references', label: 'References' },
  { value: 'interests', label: 'Interests & Hobbies' }
];

export const CustomOptionsForm: React.FC<CustomOptionsFormProps> = ({ data, onDataUpdate }) => {
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionContent, setNewSectionContent] = useState('');
  const [newSectionType, setNewSectionType] = useState('text');
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null);

  const customSections = data.customSections || [];

  const addCustomSection = () => {
    if (!newSectionTitle.trim() || !newSectionContent.trim()) return;

    const newSection = {
      title: newSectionTitle.trim(),
      content: newSectionContent.trim(),
      type: newSectionType
    };

    const updatedSections = [...customSections, newSection];
    onDataUpdate({ ...data, customSections: updatedSections });
    
    setNewSectionTitle('');
    setNewSectionContent('');
    setNewSectionType('text');
  };

  const removeCustomSection = (index: number) => {
    const updatedSections = customSections.filter((_, i) => i !== index);
    onDataUpdate({ ...data, customSections: updatedSections });
  };

  const updateCustomSection = (index: number, field: string, value: string) => {
    const updatedSections = customSections.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    );
    onDataUpdate({ ...data, customSections: updatedSections });
  };

  const enhanceCustomSection = async (index: number) => {
    setEnhancingIndex(index);
    try {
      const { geminiService } = await import('@/services/geminiService');
      const section = customSections[index];
      
      const prompt = `
Enhance this resume section content for maximum professional impact:

Section Type: ${section.type}
Section Title: ${section.title}
Current Content: ${section.content}

Instructions:
1. Make it more professional and compelling
2. Use action verbs and quantifiable achievements
3. Optimize for ATS systems
4. Keep the tone consistent with professional resume standards
5. Maintain the original intent but enhance clarity and impact

Return only the enhanced content, no additional formatting.
`;

      const enhanced = await geminiService.enhanceCustomContent(
        section.content, 
        section.type, 
        section.title
      );
      updateCustomSection(index, 'content', enhanced);
    } catch (error) {
      console.error('Failed to enhance section:', error);
    } finally {
      setEnhancingIndex(null);
    }
  };

  const renderSectionPreview = (section: any, index: number) => {
    switch (section.type) {
      case 'list':
        const items = section.content.split('\n').filter(item => item.trim());
        return (
          <ul className="list-disc list-inside space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground">{item.trim()}</li>
            ))}
          </ul>
        );
      default:
        return <p className="text-sm text-muted-foreground">{section.content}</p>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Custom Sections */}
      {customSections.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Custom Sections
          </h3>
          {customSections.map((section, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Input
                      value={section.title}
                      onChange={(e) => updateCustomSection(index, 'title', e.target.value)}
                      className="font-medium border-none px-0 text-base"
                      placeholder="Section Title"
                    />
                    <Badge variant="outline" className="mt-1">
                      {sectionTypes.find(t => t.value === section.type)?.label}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => enhanceCustomSection(index)}
                      disabled={enhancingIndex === index}
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomSection(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={section.content}
                  onChange={(e) => updateCustomSection(index, 'content', e.target.value)}
                  placeholder={
                    section.type === 'list' 
                      ? 'Enter each item on a new line'
                      : 'Enter section content...'
                  }
                  className="min-h-20"
                />
                <div className="bg-muted p-3 rounded-lg">
                  <Label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Preview:
                  </Label>
                  {renderSectionPreview(section, index)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Custom Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Custom Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Section Title</Label>
              <Input
                placeholder="e.g., Awards & Honors, Publications"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>Section Type</Label>
              <Select value={newSectionType} onValueChange={setNewSectionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sectionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Content</Label>
            <Textarea
              placeholder={
                newSectionType === 'list'
                  ? 'Enter each item on a new line:\n• First achievement\n• Second achievement\n• Third achievement'
                  : 'Enter your content here...'
              }
              value={newSectionContent}
              onChange={(e) => setNewSectionContent(e.target.value)}
              className="min-h-24"
            />
          </div>

          <Button 
            onClick={addCustomSection}
            disabled={!newSectionTitle.trim() || !newSectionContent.trim()}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </CardContent>
      </Card>

      {/* Common Custom Section Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {[
              { title: 'Awards & Honors', type: 'achievements', content: 'Dean\'s List Scholar\nEmployee of the Month\nCertification Achievement' },
              { title: 'Publications', type: 'list', content: 'Research Paper Title, Journal Name (2023)\nConference Presentation (2022)' },
              { title: 'Volunteer Work', type: 'text', content: 'Community volunteer with 100+ hours of service supporting local initiatives.' },
              { title: 'Interests', type: 'text', content: 'Photography, hiking, technology innovation, continuous learning' }
            ].map((template, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setNewSectionTitle(template.title);
                  setNewSectionType(template.type);
                  setNewSectionContent(template.content);
                }}
                className="text-xs h-auto py-2 text-left justify-start"
              >
                {template.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
