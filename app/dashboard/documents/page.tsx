'use client';

import { useState, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Plus,
  Download,
  Sparkles,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  FileSignature,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { generateLegalDocument } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { Document, DocumentType } from '@/lib/types/documents';

const documentTypes: DocumentType[] = ['Contract', 'NDA', 'Agreement', 'Policy', 'Other'];

interface DocumentFormData {
  title: string;
  documentType: DocumentType;
  description: string;
  effectiveDate: string;
  jurisdiction: string;
  prompt: string;
}

const initialFormData: DocumentFormData = {
  title: '',
  documentType: 'Contract',
  description: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  jurisdiction: '',
  prompt: '',
};

export default function DocumentsPage() {
  const { user } = useAuth();
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState<DocumentFormData>(initialFormData);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | DocumentType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user, searchQuery, typeFilter]);

  const fetchDocuments = async () => {
    try {
      let query = supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (typeFilter !== 'all') {
        query = query.eq('document_type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch documents');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    field?: string
  ) => {
    if (typeof e === 'string' && field) {
      setFormData((prev) => ({ ...prev, [field]: e }));
    } else if ('target' in e) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
    return interval;
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.documentType) {
      toast.error('Please fill in all required fields');
      return;
    }

    setGenerating(true);
    const progressInterval = simulateProgress();

    try {
      const prompt = `Generate a ${formData.documentType} with the following details:
        Title: ${formData.title}
        Description: ${formData.description}
        Effective Date: ${formData.effectiveDate}
        Jurisdiction: ${formData.jurisdiction}
        Additional Requirements: ${formData.prompt}`;

      const content = await generateLegalDocument(prompt);

      const { error } = await supabase.from('documents').insert({
        user_id: user?.id,
        title: formData.title,
        description: formData.description,
        content,
        document_type: formData.documentType,
        jurisdiction: formData.jurisdiction,
        effective_date: formData.effectiveDate,
      });

      if (error) throw error;

      toast.success('Document generated and saved successfully!');
      setShowNewDocModal(false);
      setFormData(initialFormData);
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate document');
      console.error('Error:', error);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setGenerating(false);
        setProgress(0);
      }, 500);
    }
  };

  const DocumentIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'Contract':
        return <FileSignature className="h-6 w-6 text-blue-500" />;
      case 'NDA':
        return <FileText className="h-6 w-6 text-purple-500" />;
      case 'Agreement':
        return <BookOpen className="h-6 w-6 text-green-500" />;
      case 'Policy':
        return <FileText className="h-6 w-6 text-orange-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Generation</h1>
        <Button
          onClick={() => setShowNewDocModal(true)}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search documents..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(value: 'all' | DocumentType) => setTypeFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading documents...
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No documents found
              </div>
            ) : (
              documents.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-gradient-to-r from-background to-accent/5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <DocumentIcon type={doc.document_type} />
                        <div>
                          <h2 className="text-xl font-semibold">{doc.title}</h2>
                          <p className="text-muted-foreground mt-1">{doc.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(doc.created_at).toLocaleDateString()}
                            </div>
                            {doc.jurisdiction && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {doc.jurisdiction}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGeneratedContent(doc.content);
                            setShowPreviewModal(true);
                          }}
                          className="hover:scale-105 transition-transform"
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
                          className="hover:scale-105 transition-transform"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Card>

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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate New Document</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <Input
                  name="title"
                  placeholder="Enter document title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value: DocumentType) => handleInputChange(value, 'documentType')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  name="description"
                  placeholder="Brief description of the document"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Effective Date</label>
                  <Input
                    name="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Jurisdiction</label>
                  <Input
                    name="jurisdiction"
                    placeholder="e.g., California, USA"
                    value={formData.jurisdiction}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Additional Requirements</label>
                <Textarea
                  name="prompt"
                  placeholder="Any specific clauses or requirements..."
                  value={formData.prompt}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            {generating && (
              <div className="w-full mb-4">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground mt-2">
                  Generating document... {progress}%
                </p>
              </div>
            )}
            <Button variant="outline" onClick={() => setShowNewDocModal(false)} disabled={generating}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={generating}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
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
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {generating ? 'Generating...' : 'Generate Document'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}