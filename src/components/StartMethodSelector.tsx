import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Upload, Sparkles } from 'lucide-react';
import type { StartMethod } from './ResumeBuilder';

interface StartMethodSelectorProps {
  selectedMethod: StartMethod;
  onMethodChange: (method: StartMethod | null) => void;
}

export const StartMethodSelector: React.FC<StartMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange
}) => {
  const methods = [
    { id: 'scratch' as StartMethod, label: 'From Scratch', icon: FileText },
    { id: 'upload' as StartMethod, label: 'Upload PDF', icon: Upload },
    { id: 'prompt' as StartMethod, label: 'AI Generate', icon: Sparkles }
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Build Method</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onMethodChange(null)}
          >
            Change Method
          </Button>
        </div>
        <div className="flex gap-2">
          {methods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            return (
              <div
                key={method.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-muted border-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{method.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};