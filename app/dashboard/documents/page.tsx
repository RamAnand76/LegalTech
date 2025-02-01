'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentFormData {
  title: string;
  description: string;
  prompt: string;
}

export default function DocumentsPage() {
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState<DocumentFormData>({
    title: '',
    description: '',
    prompt: '',
  });
  const [generatedContent, setGeneratedContent] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.prompt) {
      toast.error('Please fill in all fields');
      return;
    }

    setGenerating(true);

    try {
      // Simulate AI generation with dummy content
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const dummyContent = `
# ${formData.title}

## Executive Summary
${formData.description}

## Introduction
This document outlines the key provisions and terms related to [Subject Matter].

## Terms and Conditions
1. Parties Involved
   - Party A: [Name/Organization]
   - Party B: [Name/Organization]

2. Scope of Agreement
   - This agreement covers the following areas:
   - [Area 1]
   - [Area 2]
   - [Area 3]

3. Duration
   - Effective Date: [Date]
   - Term: [Period]

4. Responsibilities
   4.1 Party A shall:
   - [Responsibility 1]
   - [Responsibility 2]

   4.2 Party B shall:
   - [Responsibility 1]
   - [Responsibility 2]

5. Confidentiality
   Both parties agree to maintain the confidentiality of any sensitive information shared during the course of this agreement.

## Signatures
- Party A: ________________
- Party B: ________________

Date: ________________
`;

      setGeneratedContent(dummyContent);
      toast.success('Document generated successfully!');
      setShowNewDocModal(false);
    } catch (error) {
      toast.error('Failed to generate document');
      console.error('Error:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Generation</h1>
        <Button onClick={() => setShowNewDocModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      {generatedContent && (
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{formData.title}</h2>
              <p className="text-muted-foreground mt-1">{formData.description}</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
          <div className="mt-4">
            <Textarea
              value={generatedContent}
              className="min-h-[400px] font-mono"
              readOnly
            />
          </div>
        </Card>
      )}

      <Dialog open={showNewDocModal} onOpenChange={setShowNewDocModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter document title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter document description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Generation Prompt</label>
              <Textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                placeholder="Enter your requirements for the document"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewDocModal(false)}
              disabled={generating}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={generating}>
              {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {generating ? 'Generating...' : 'Generate Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}