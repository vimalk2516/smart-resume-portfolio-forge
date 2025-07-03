import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ExternalLink, Eye, Globe } from 'lucide-react';
import type { ResumeData } from './ResumeBuilder';
import { PortfolioGenerator } from './PortfolioGenerator';
import { generatePDF } from '@/utils/pdfGenerator';

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('resume');

  const handleDownloadPDF = async () => {
    try {
      await generatePDF(data);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resume" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Resume Preview
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Portfolio
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="resume">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Resume Preview
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
        <div className="bg-white border rounded-lg p-6 text-black min-h-96 space-y-4">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {data.personalInfo.fullName || 'Your Name'}
            </h1>
            <div className="text-sm text-gray-600 mt-2 space-x-2">
              {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
              {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
              {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
            </div>
          </div>

          {/* Career Objective */}
          {data.careerObjective && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Career Objective</h2>
              <p className="text-sm text-gray-700">{data.careerObjective}</p>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Education</h2>
              <div className="space-y-2">
                {data.education.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-gray-900">{edu.degree}</div>
                    <div className="text-gray-600">{edu.college} • {edu.year}</div>
                    {edu.grade && <div className="text-gray-600">Grade: {edu.grade}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
              <div className="space-y-3">
                {data.experience.map((exp, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-gray-900">{exp.role}</div>
                    <div className="text-gray-600">{exp.company} • {exp.duration}</div>
                    <div className="text-gray-700 mt-1">{exp.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
              {data.skills.technical.length > 0 && (
                <div className="mb-2">
                  <div className="font-medium text-gray-900 text-sm">Technical Skills</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.skills.technical.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.soft.length > 0 && (
                <div>
                  <div className="font-medium text-gray-900 text-sm">Soft Skills</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.skills.soft.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Projects</h2>
              <div className="space-y-2">
                {data.projects.map((project, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-gray-900">{project.title}</div>
                    <div className="text-gray-700">{project.description}</div>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
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

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Certifications</h2>
              <div className="space-y-1">
                {data.certifications.map((cert, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium text-gray-900">{cert.name}</div>
                    <div className="text-gray-600">{cert.issuer} • {cert.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Languages</h2>
              <div className="flex flex-wrap gap-1">
                {data.languages.map((language, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
            </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="portfolio">
          <PortfolioGenerator data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};