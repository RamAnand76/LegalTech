'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Search, Filter } from 'lucide-react';

export default function ContractsPage() {
  const [contracts] = useState([
    { id: 1, name: 'Service Agreement', status: 'Pending Review', date: '2024-03-20' },
    { id: 2, name: 'Employment Contract', status: 'Reviewed', date: '2024-03-19' },
    { id: 3, name: 'NDA Agreement', status: 'In Progress', date: '2024-03-18' },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contract Review</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Contract
        </Button>
      </div>

      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contracts..."
              className="pl-9 w-full h-10 rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="space-y-4">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">{contract.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Uploaded on {contract.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">{contract.status}</span>
                <Button variant="outline" size="sm">Review</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}