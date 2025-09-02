// API client for MySQL backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: number;
  text: string;
  author?: string;
  created_by?: string;
  category?: string;
  tags?: string;
  created_at: string;
  updated_at: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      cache: 'no-store',
      ...options,
    };

    try {
      console.debug('[apiClient] request', url, config.method || 'GET');
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Posts API
  async getPosts(author?: string): Promise<Post[]> {
    const query = author ? `?author=${encodeURIComponent(author)}` : '';
    return this.request<Post[]>(`/posts${query}`);
  }

  // Quotes API
  async getQuotes(createdBy?: string): Promise<QuoteItem[]> {
    const query = createdBy ? `?created_by=${encodeURIComponent(createdBy)}` : '';
    return this.request<QuoteItem[]>(`/quotes${query}`);
  }

  async createQuote(text: string, author?: string, createdBy?: string, category?: string, tags?: string): Promise<QuoteItem> {
    return this.request<QuoteItem>('/quotes', {
      method: 'POST',
      body: JSON.stringify({ text, author, created_by: createdBy, category, tags }),
    });
  }

  async getPost(id: number): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(title: string, content: string, image_url?: string, author?: string): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content, image_url, author }),
    });
  }

  async updatePost(id: number, title: string, content: string, image_url?: string): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, image_url }),
    });
  }

  async deletePost(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/health');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export the class for testing purposes
export { ApiClient };
