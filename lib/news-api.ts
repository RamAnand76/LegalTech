import { NewsResponse, NewsFilters } from '@/lib/types/news';

const GNEWS_API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cache: { [key: string]: { data: NewsResponse; timestamp: number } } = {};

export async function fetchLegalNews(filters: NewsFilters): Promise<NewsResponse> {
  const { country, page } = filters;
  const cacheKey = `${country}-${page}`;

  // Check cache
  const cached = cache[cacheKey];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?` +
      `q=legal+law+court+legislation` +
      `&country=${country}` +
      `&page=${page}` +
      `&max=10` +
      `&apikey=${GNEWS_API_KEY}` +
      `&category=general`
    );

    if (!response.ok) {
      throw new Error(`News API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform the response to match our interface
    const transformedData: NewsResponse = {
      totalArticles: data.totalArticles,
      articles: data.articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: {
          name: article.source.name,
          url: article.source.url,
        },
      })),
    };

    // Update cache
    cache[cacheKey] = {
      data: transformedData,
      timestamp: Date.now(),
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

// Clear old cache entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(cache).forEach((key) => {
    if (now - cache[key].timestamp > CACHE_DURATION) {
      delete cache[key];
    }
  });
}, CACHE_DURATION);