export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
}

export interface NewsItem {
  id: number;
  title: string;
  titles: {
    default: string;
    sg?: string;
    rfb?: string;
    kpf: string;
    ewf?: string;
    bpf?: string;
  };
  slug: string;
  content: string;
  category_id: number;
  kategori?: {
    id: number;
    name: string;
    slug: string;
  };
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface NewsApiResponse {
  current_page: number;
  data: NewsItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const API_BASE_URL = 'https://portalnews.newsmaker.id/api/v1/berita';
const API_TOKEN = 'BPF-91e516ac4fe2e8ae';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${API_TOKEN}`);
  headers.set('Accept', 'application/json');
  
  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store' as const
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} on ${url}`);
  }
  
  return response.json();
};

export const fetchLatestNews = async (limit = 3): Promise<NewsItem[]> => {
  try {
    const data = await fetchWithAuth(
      `${API_BASE_URL}?per_page=${limit}&sort_by=created_at&order=desc`
    );
    
    // Process each news item to prioritize BPF title and use 5th image (index 4)
    const processedData = data.data.map((item: NewsItem) => {
      // For images, we want to use the 5th image (index 4) if it exists
      let mainImage = null;
      if (item.images?.length > 4) {
        mainImage = item.images[4];
      } else if (item.images?.length > 0) {
        mainImage = item.images[0]; // Fallback to first image if no 5th image
      }
      
      return {
        ...item,
        title: item.titles?.bpf || item.titles?.ewf || item.title, // Use BPF title if available, fallback to EWF, then default
        images: mainImage ? [mainImage] : []
      };
    });
    
    return processedData || [];
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
};

export const fetchNews = async (
  page = 1, 
  perPage = 9, 
  sortBy = 'created_at', 
  order = 'desc'
): Promise<NewsApiResponse> => {
  try {
    const data = await fetchWithAuth(
      `${API_BASE_URL}?page=${page}&per_page=${perPage}&sort_by=${sortBy}&order=${order}`
    );
    
    // Process each news item to prioritize BPF title and use 5th image (index 4)
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map((item: NewsItem) => {
        // For images, we want to use the 5th image (index 4) if it exists
        let mainImage = null;
        if (item.images?.length > 4) {
          mainImage = item.images[4];
        } else if (item.images?.length > 0) {
          mainImage = item.images[0]; // Fallback to first image if no 5th image
        }
        
        return {
          ...item,
          title: item.titles?.bpf || item.titles?.ewf || item.title, // Use BPF title if available, fallback to EWF, then default
          images: mainImage ? [mainImage] : []
        };
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const fetchFeaturedNews = async (limit = 3): Promise<NewsItem[]> => {
  try {
    const response = await fetchNews(1, limit, 'created_at', 'desc');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching featured news:', error);
    return [];
  }
};

export const fetchNewsDetail = async (slug: string): Promise<NewsItem | null> => {
  try {
    const result = await fetchWithAuth(`${API_BASE_URL}/${slug}`);
    
    if (result.data) {
      // For images, we want to use the 5th image (index 4) if it exists
      let mainImage = null;
      if (result.data.images?.length > 4) {
        mainImage = result.data.images[4];
      } else if (result.data.images?.length > 0) {
        mainImage = result.data.images[0]; // Fallback to first image if no 5th image
      }
      
      // Update the data with BPF title and processed images
      result.data = {
        ...result.data,
        title: result.data.titles?.bpf || result.data.titles?.ewf || result.data.title,
        images: mainImage ? [mainImage] : []
      };
    }
    
    return result.data || null;
  } catch (error) {
    console.error('Error fetching news detail:', error);
    return null;
  }
};
