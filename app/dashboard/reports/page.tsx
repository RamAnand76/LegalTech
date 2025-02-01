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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Plus, AlertCircle, Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Report {
  id: string;
  title: string;
  content: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Pending Review' | 'Under Investigation' | 'Resolved';
  created_at: string;
  user_id: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [newReport, setNewReport] = useState({
    title: '',
    content: '',
    severity: 'Medium' as 'Medium' | 'High' | 'Low',
  });

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user, searchQuery, severityFilter, statusFilter]);

  const fetchReports = async () => {
    try {
      let query = supabase
        .from('corruption_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      if (severityFilter !== 'all') {
        query = query.eq('severity', severityFilter);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReports(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch reports');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from('corruption_reports').insert({
        user_id: user.id,
        title: newReport.title,
        content: newReport.content,
        severity: newReport.severity,
        status: 'Pending Review',
      });

      if (error) throw error;

      toast.success('Report submitted successfully');
      setNewReport({ title: '', content: '', severity: 'Medium' });
      fetchReports();
    } catch (error: any) {
      toast.error('Failed to submit report');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Corruption Reporting</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Submit New Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Input
                  placeholder="Report Title"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Report Content"
                  value={newReport.content}
                  onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                  className="min-h-[150px]"
                />
              </div>
              <div>
                <Select
                  value={newReport.severity}
                  onValueChange={(value: 'High' | 'Medium' | 'Low') =>
                    setNewReport({ ...newReport, severity: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleSubmitReport}>
                Submit Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search reports..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending Review">Pending Review</SelectItem>
              <SelectItem value="Under Investigation">Under Investigation</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No reports found
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Filed on {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    report.severity === 'High' ? 'bg-red-100 text-red-800' :
                    report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {report.severity}
                  </span>
                  <span className="text-sm text-muted-foreground">{report.status}</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(report)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Report Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <h3 className="font-semibold text-lg">{report.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Filed on {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-4">
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                            report.severity === 'High' ? 'bg-red-100 text-red-800' :
                            report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {report.severity}
                          </span>
                          <span className="text-sm font-medium px-2 py-1 rounded-full bg-secondary">
                            {report.status}
                          </span>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="whitespace-pre-wrap">{report.content}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex items-start space-x-4">
          <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-amber-800">Confidential Reporting</h3>
            <p className="text-sm text-amber-700 mt-1">
              All reports are handled with strict confidentiality. Your identity will be protected throughout the investigation process.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}