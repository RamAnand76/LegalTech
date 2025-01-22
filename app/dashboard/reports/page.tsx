'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Plus, AlertCircle } from 'lucide-react';

export default function ReportsPage() {
  const [reports] = useState([
    { id: 1, title: 'Financial Irregularity', severity: 'High', date: '2024-03-20', status: 'Under Investigation' },
    { id: 2, title: 'Procurement Violation', severity: 'Medium', date: '2024-03-19', status: 'Resolved' },
    { id: 3, title: 'Policy Breach', severity: 'Low', date: '2024-03-18', status: 'Pending Review' },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Corruption Reporting</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Shield className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">{report.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Filed on {report.date}
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
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          ))}
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