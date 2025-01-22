'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Download } from 'lucide-react';

export default function DocumentsPage() {
  const [templates] = useState([
    { id: 1, name: 'Non-Disclosure Agreement', category: 'Legal', lastUsed: '2024-03-20' },
    { id: 2, name: 'Employment Contract', category: 'HR', lastUsed: '2024-03-19' },
    { id: 3, name: 'Service Agreement', category: 'Business', lastUsed: '2024-03-18' },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Document Generation</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {templates.map((template) => (
          <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-sm font-medium px-2 py-1 rounded-full bg-secondary">
                {template.category}
              </span>
            </div>
            <h3 className="font-medium mb-2">{template.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Last used: {template.lastUsed}
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Use Template
              </Button>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Documents</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-medium">Generated Document #{i}</h3>
                  <p className="text-sm text-muted-foreground">
                    Created {i} day{i !== 1 ? 's' : ''} ago
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}