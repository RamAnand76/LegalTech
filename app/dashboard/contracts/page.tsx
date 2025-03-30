'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Upload, Search, Filter, Eye, Info } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { Contract, ContractStatus } from '@/lib/types/contracts';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { processContractReview } from '@/lib/utils/contract-review';

export default function ContractsPage() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchContracts();
    }
  }, [user, statusFilter, searchQuery]);

  const fetchContracts = async () => {
    try {
      let query = supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('file_name', `%${searchQuery}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setContracts(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch contracts');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, JPG, or PNG files only.');
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      toast.error('File size must be less than 6MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from('contracts').insert({
        user_id: user?.id,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        status: 'pending'
      });

      if (dbError) throw dbError;

      toast.success('Contract uploaded successfully');
      fetchContracts();
    } catch (error: any) {
      toast.error('Failed to upload contract');
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (contract: Contract) => {
    try {
      const { data, error } = await supabase.storage
        .from('contracts')
        .createSignedUrl(contract.file_path, 60);

      if (error) throw error;

      setPreviewUrl(data.signedUrl);
      setSelectedContract(contract);
      setShowPreview(true);
    } catch (error: any) {
      toast.error('Failed to load preview');
      console.error('Error:', error);
    }
  };

  const handleReview = async (contract: Contract) => {
    if (contract.status === 'in_review') {
      toast.error('Contract is already being reviewed');
      return;
    }

    setReviewing(true);
    setSelectedContract(contract);
    setShowReview(true);
    setReviewContent(''); // Clear previous review content

    try {
      // Check if review already exists with proper query
      const { data: existingReview, error: reviewError } = await supabase
        .from('contract_reviews')
        .select('review_content')  // Changed from 'content' to 'review_content'
        .eq('contract_id', contract.id)
        .limit(1)
        .single();

      if (reviewError && reviewError.code !== 'PGRST116') {
        throw reviewError;
      }

      if (existingReview) {
        setReviewContent(existingReview.review_content);  // Changed from 'content' to 'review_content'
      } else {
        const review = await processContractReview(contract);
        setReviewContent(review);
      }
      
      await fetchContracts();
    } catch (error: any) {
      toast.error('Failed to review document: ' + error.message);
      console.error('Error:', error);
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contract Review</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">Max file size: 6MB</p>
          <Button disabled={uploading}>
            <Upload className="mr-2 h-4 w-4" />
            <label className="cursor-pointer">
              {uploading ? 'Uploading...' : 'Upload Contract'}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </Button>
        </div>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search contracts..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value: ContractStatus | 'all') => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">In Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading contracts...
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No contracts found
            </div>
          ) : (
            contracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <FileText className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">{contract.file_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Uploaded on {new Date(contract.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    contract.status === 'completed' ? 'bg-green-100 text-green-800' :
                    contract.status === 'in_review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {contract.status.replace('_', ' ').charAt(0).toUpperCase() + contract.status.slice(1)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(contract)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {contract.status === 'completed' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReview(contract)}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      View Report
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={contract.status !== 'pending'}
                      onClick={() => handleReview(contract)}
                    >
                      {contract.status === 'pending' ? 'Review' : 'Processing...'}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[80vh]" aria-describedby="preview-description">
          <DialogHeader>
            <DialogTitle>{selectedContract?.file_name}</DialogTitle>
          </DialogHeader>
          <p id="preview-description" className="sr-only">
            Preview of contract document {selectedContract?.file_name}
          </p>
          {previewUrl && (
            <div className="flex-1 w-full h-full min-h-[60vh]">
              <iframe
                src={previewUrl}
                className="w-full h-full rounded-md"
                title="Contract Preview"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={showReview} onOpenChange={setShowReview}>
        <DialogContent className="max-w-4xl h-[80vh]" aria-describedby="review-description">
          <DialogHeader>
            <DialogTitle>
              Contract Analysis Report - {selectedContract?.file_name}
            </DialogTitle>
          </DialogHeader>
          <p id="review-description" className="sr-only">
            AI-generated analysis of contract {selectedContract?.file_name}
          </p>
          <ScrollArea className="h-full mt-4 rounded-md border p-4">
            {reviewing ? (
              <div className="flex items-center justify-center h-full">
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
                  className="text-primary"
                >
                  <FileText className="h-8 w-8" />
                </motion.div>
                <p className="ml-2">Analyzing document...</p>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-primary">
                <ReactMarkdown>{reviewContent}</ReactMarkdown>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}