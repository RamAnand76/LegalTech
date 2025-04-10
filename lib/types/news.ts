export interface NewsArticle {
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    publishedAt: string;
    source: {
      name: string;
      url: string;
    };
  }
  
  export interface NewsResponse {
    totalArticles: number;
    articles: NewsArticle[];
  }
  
  export interface NewsFilters {
    country: string;
    page: number;
  }