'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchLegalNews } from '@/lib/news-api';
import { NewsArticle } from '@/lib/types/news';
import { Globe, ExternalLink, Calendar, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const countries = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'in', name: 'India' },
  { code: 'ca', name: 'Canada' },
  { code: 'au', name: 'Australia' },
];

export default function NewsPage() {
  const [country, setCountry] = useState('us');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['legal-news', country, page],
    queryFn: () => fetchLegalNews({ country, page }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (isError) {
    toast.error('Failed to load news articles');
    console.error('Error:', error);
  }

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Legal News</h1>
        <div className="flex items-center gap-4">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={data?.articles.length || 0}
          next={loadMore}
          hasMore={(data?.totalArticles || 0) > (data?.articles.length || 0)}
          loader={<div className="text-center py-4">Loading more articles...</div>}
          className="space-y-6"
        >
          {data?.articles.map((article: NewsArticle, index: number) => (
            <motion.div
              key={`${article.url}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:bg-accent/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {article.image && (
                    <div className="md:col-span-1">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop';
                        }}
                      />
                    </div>
                  )}
                  <div className={`${article.image ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Building2 className="h-4 w-4" />
                      <span>{article.source.name}</span>
                      <span>•</span>
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                    </div>
                    
                    <h2 className="text-xl font-semibold mb-3">{article.title}</h2>
                    <p className="text-muted-foreground mb-4">{article.description}</p>
                    
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary/90"
                    >
                      Read full article
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}