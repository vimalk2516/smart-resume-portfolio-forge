import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import type { ResumeData } from '../ResumeBuilder';

interface CertificationsFormProps {
  data: ResumeData;
  onDataUpdate: (data: Partial<ResumeData>) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({ data, onDataUpdate }) => {
  const addCertification = () => {
    const newCertifications = [...data.certifications, { name: '', issuer: '', date: '' }];
    onDataUpdate({ certifications: newCertifications });
  };

  const updateCertification = (index: number, field: string, value: string) => {
    const newCertifications = data.certifications.map((cert, i) => 
      i === index ? { ...cert, [field]: value } : cert
    );
    onDataUpdate({ certifications: newCertifications });
  };

  const removeCertification = (index: number) => {
    const newCertifications = data.certifications.filter((_, i) => i !== index);
    onDataUpdate({ certifications: newCertifications });
  };

  return (
    <div className="space-y-4">
      {data.certifications.map((cert, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Certification {index + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCertification(index)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Certification Name *</Label>
              <Input
                placeholder="AWS Certified Developer"
                value={cert.name}
                onChange={(e) => updateCertification(index, 'name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Issuing Organization</Label>
                <Input
                  placeholder="Amazon Web Services"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                />
              </div>
              <div>
                <Label>Date Obtained</Label>
                <Input
                  placeholder="Jan 2024"
                  value={cert.date}
                  onChange={(e) => updateCertification(index, 'date', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button variant="outline" onClick={addCertification} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Certification
      </Button>
    </div>
  );
};