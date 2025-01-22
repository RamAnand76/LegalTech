'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, BookOpen, ExternalLink } from 'lucide-react';

export default function NewsPage() {
  const [news] = useState([
    {
      id: 1,
      title: 'Supreme Court Issues New Guidelines on Digital Evidence',
      category: 'Legal Updates',
      summary: 'New framework for handling digital evidence in court proceedings...',
      source: 'Legal Times',
      date: '2024-03-20',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Major Changes in Corporate Law Coming in 2024',
      category: 'Corporate Law',
      summary: 'Upcoming amendments to the Companies Act that will affect businesses...',
      source: 'Business Law Review',
      date: '2024-03-19',
      readTime: '8 min read',
    },
    {
      id: 3,
      title: 'New Data Protection Regulations Announced',
      category: 'Privacy Law',
      summary: 'Government announces stricter data protection measures...',
      source: 'Tech Law Journal',
      date: '2024-03-18',
      readTime: '6 min read',
    },
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Legal News</h1>
        <div className="flex gap-4">
          <Button variant="outline">
            Filter by Category
          </Button>
          <Button>
            Subscribe to Updates
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {news.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-secondary">
                    {item.category}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.date}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {item.readTime}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-muted-foreground mb-4">{item.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Source: {item.source}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read More
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}