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
import { FileText, Plus, Download, Sparkles, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { generateLegalDocument } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PartyDetails {
  name: string;
  age: string;
  address: string;
  email: string;
  phone: string;
}

interface DocumentFormData {
  title: string;
  description: string;
  prompt: string;
  documentType: string;
  party1: PartyDetails;
  party2: PartyDetails;
  effectiveDate: string;
  jurisdiction: string;
}

const initialPartyDetails: PartyDetails = {
  name: '',
  age: '',
  address: '',
  email: '',
  phone: '',
};

const initialFormData: DocumentFormData = {
  title: '',
  description: '',
  prompt: '',
  documentType: '',
  party1: { ...initialPartyDetails },
  party2: { ...initialPartyDetails },
  effectiveDate: new Date().toISOString().split('T')[0],
  jurisdiction: '',
};

export default function DocumentsPage() {
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState<DocumentFormData>(initialFormData);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [documents, setDocuments] = useState<Array<{ title: string; description: string; content: string }>>([]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    party?: 'party1' | 'party2'
  ) => {
    const { name, value } = e.target;
    
    if (party) {
      setFormData((prev) => ({
        ...prev,
        [party]: {
          ...prev[party],
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const generatePrompt = () => {
    return `
Generate a ${formData.documentType} with the following details:

Document Title: ${formData.title}
Description: ${formData.description}

Party 1 Details:
- Name: ${formData.party1.name}
- Age: ${formData.party1.age}
- Address: ${formData.party1.address}
- Email: ${formData.party1.email}
- Phone: ${formData.party1.phone}

Party 2 Details:
- Name: ${formData.party2.name}
- Age: ${formData.party2.age}
- Address: ${formData.party2.address}
- Email: ${formData.party2.email}
- Phone: ${formData.party2.phone}

Effective Date: ${formData.effectiveDate}
Jurisdiction: ${formData.jurisdiction}

Additional Requirements:
${formData.prompt}
`;
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.documentType || !formData.party1.name || !formData.party2.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    setGenerating(true);

    try {
      const prompt = generatePrompt();
      const content = await generateLegalDocument(prompt);
      const newDocument = {
        title: formData.title,
        description: formData.description,
        content,
      };
      setDocuments(prev => [newDocument, ...prev]);
      setGeneratedContent(content);
      toast.success('Document generated successfully!');
      setShowNewDocModal(false);
      setFormData(initialFormData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate document');
      console.error('Error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const PartyForm = ({ party, label }: { party: 'party1' | 'party2', label: string }) => (
    <div className="space-y-4">
      <h3 className="font-semibold">{label}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="name"
          placeholder="Full Name"
          value={formData[party].name}
          onChange={(e) => handleInputChange(e, party)}
        />
        <Input
          name="age"
          type="number"
          placeholder="Age"
          value={formData[party].age}
          onChange={(e) => handleInputChange(e, party)}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={formData[party].email}
          onChange={(e) => handleInputChange(e, party)}
        />
        <Input
          name="phone"
          placeholder="Phone"
          value={formData[party].phone}
          onChange={(e) => handleInputChange(e, party)}
        />
        <div className="col-span-2">
          <Input
            name="address"
            placeholder="Address"
            value={formData[party].address}
            onChange={(e) => handleInputChange(e, party)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Generation</h1>
        <Button onClick={() => setShowNewDocModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      <div className="grid gap-6">
        {documents.map((doc, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">{doc.title}</h2>
                <p className="text-muted-foreground mt-1">{doc.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setGeneratedContent(doc.content);
                    setShowPreviewModal(true);
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const blob = new Blob([doc.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${doc.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Document Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-full mt-4 rounded-md border p-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{generatedContent}</ReactMarkdown>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* New Document Modal */}
      <Dialog open={showNewDocModal} onOpenChange={setShowNewDocModal}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Generate New Document</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-1">
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="title"
                  placeholder="Document Title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
                <Input
                  name="documentType"
                  placeholder="Document Type (e.g., NDA, Contract)"
                  value={formData.documentType}
                  onChange={handleInputChange}
                />
              </div>
              
              <Textarea
                name="description"
                placeholder="Document Description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="effectiveDate"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                />
                <Input
                  name="jurisdiction"
                  placeholder="Jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleInputChange}
                />
              </div>
              
              <PartyForm party="party1" label="Party 1 Details" />
              <PartyForm party="party2" label="Party 2 Details" />

              <div>
                <Textarea
                  name="prompt"
                  placeholder="Additional requirements or specific clauses..."
                  value={formData.prompt}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </div>
          </ScrollArea>

          <div className="border-t pt-4 mt-4">
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewDocModal(false)}
                disabled={generating}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={generating}>
                {generating ? (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="mr-2"
                    style={{
                      background: "linear-gradient(45deg, #FFD700, #FFA500)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 0 2px rgba(255, 215, 0, 0.5))"
                    }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {generating ? 'Generating...' : 'Generate Document'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}