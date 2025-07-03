import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Sparkles } from 'lucide-react';
import type { ResumeData } from '../ResumeBuilder';

interface UploadFormProps {
  onDataUpdate: (data: Partial<ResumeData>) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onDataUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      setIsUploading(true);
      
      // Simulate upload process
      setTimeout(() => {
        setIsUploading(false);
      }, 2000);
    }
  };

  const processWithAI = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    
    // TODO: Implement PDF parsing and AI enhancement
    // For now, simulate the process
    setTimeout(() => {
      // Mock extracted data
      const mockData: Partial<ResumeData> = {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          location: 'New York, NY'
        },
        careerObjective: 'Experienced software developer seeking new opportunities',
        education: [{
          degree: 'Bachelor of Computer Science',
          college: 'State University',
          year: '2020'
        }],
        experience: [{
          company: 'Tech Corp',
          role: 'Software Developer',
          duration: '2020 - Present',
          description: 'Developed web applications using React and Node.js'
        }],
        skills: {
          technical: ['JavaScript', 'React', 'Node.js', 'Python'],
          soft: ['Communication', 'Team Leadership']
        }
      };
      
      onDataUpdate(mockData);
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!uploadedFile ? (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload your resume</h3>
            <p className="text-muted-foreground mb-4">
              Upload a PDF resume and let AI extract and enhance your information
            </p>
            <div className="flex justify-center">
              <label htmlFor="resume-upload" className="cursor-pointer">
                <Button variant="gradient" className="pointer-events-none">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose PDF File
                </Button>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <FileText className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <h4 className="font-medium">{uploadedFile.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {Math.round(uploadedFile.size / 1024)} KB
                </p>
              </div>
              {isUploading && (
                <div className="text-sm text-primary">Uploading...</div>
              )}
            </div>
            
            <Button
              variant="hero"
              onClick={processWithAI}
              disabled={isProcessing || isUploading}
              className="w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing with AI...' : 'Extract & Enhance with AI'}
            </Button>
            
            <p className="text-sm text-muted-foreground text-center">
              AI will extract your information and suggest improvements
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};