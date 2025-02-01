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
import { FileText, Upload, Search, Filter, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { Contract, ContractStatus } from '@/lib/types/contracts';
import { toast } from 'sonner';

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

  useEffect(() => {
    if (user) {
      fetchContracts();
    }
  }, [user, statusFilter, searchQuery]); // Add dependencies to trigger fetch

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

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, JPG, or PNG files only.');
      return;
    }

    // Validate file size (6MB)
    if (file.size > 6 * 1024 * 1024) {
      toast.error('File size must be less than 6MB');
      return;
    }

    setUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('contracts')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create contract record
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
        .createSignedUrl(contract.file_path, 60); // URL valid for 60 seconds

      if (error) throw error;

      setPreviewUrl(data.signedUrl);
      setSelectedContract(contract);
      setShowPreview(true);
    } catch (error: any) {
      toast.error('Failed to load preview');
      console.error('Error:', error);
    }
  };

  const handleReview = async (contractId: string) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .update({ status: 'in_review' })
        .eq('id', contractId);

      if (error) throw error;

      // Simulate review process
      setTimeout(async () => {
        try {
          // Update contract status
          const { error: updateError } = await supabase
            .from('contracts')
            .update({ status: 'completed' })
            .eq('id', contractId);

          if (updateError) throw updateError;

          // Create review
          const { error: reviewError } = await supabase
            .from('contract_reviews')
            .insert({
              contract_id: contractId,
              summary: 'Contract review completed successfully.',
              risk_level: 'low',
              recommendations: ['No major issues found', 'Ready for signing']
            });

          if (reviewError) throw reviewError;

          toast.success('Contract review completed');
          fetchContracts();
        } catch (error: any) {
          toast.error('Failed to complete review');
          console.error('Error:', error);
        }
      }, 5000); // Simulate 5-second review process

      fetchContracts();
    } catch (error: any) {
      toast.error('Failed to start review');
      console.error('Error:', error);
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
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={contract.status !== 'pending'}
                    onClick={() => handleReview(contract.id)}
                  >
                    {contract.status === 'pending' ? 'Review' : 
                     contract.status === 'in_review' ? 'Processing...' : 'View Report'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedContract?.file_name}</DialogTitle>
          </DialogHeader>
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
    </div>
  );
}