// API client for MySQL backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
export const API_ORIGIN = (() => {
  try {
    const u = new URL(API_BASE_URL);
    return `${u.protocol}//${u.host}`;
  } catch {
    return 'http://localhost:3001';
  }
})();

export interface Post {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  author?: string;
  likes?: number;
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

  async likePost(id: number): Promise<{ likes: number }> {
    return this.request<{ likes: number }>(`/posts/${id}/like`, { method: 'POST' });
  }

  async unlikePost(id: number): Promise<{ likes: number }> {
    return this.request<{ likes: number }>(`/posts/${id}/unlike`, { method: 'POST' });
  }

  // Comments API
  async getComments(postId: number): Promise<Array<{ id: number; post_id: number; author?: string; text: string; created_at: string }>> {
    return this.request(`/posts/${postId}/comments`);
  }

  async addComment(postId: number, text: string, author?: string) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text, author }),
    });
  }

  // Uploads API
  async uploadImages(files: File[]): Promise<{ files: Array<{ filename: string; url: string; mimetype: string; size: number }> }> {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Galleries API
  async getGalleries(createdBy?: string): Promise<Array<{ id: number; title: string; description?: string; created_by?: string; images: string; created_at: string }>> {
    const query = createdBy ? `?created_by=${encodeURIComponent(createdBy)}` : '';
    return this.request(`/galleries${query}`);
  }

  async createGallery(params: { title: string; description?: string; created_by?: string; images: Array<{ url: string }> }): Promise<{ id: number } & Record<string, any>> {
    return this.request('/galleries', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async listUploads(): Promise<{ files: Array<{ name: string; url: string; size: number; mtime: number }> }> {
    return this.request('/uploads');
  }

  // Videos API
  async getVideos(createdBy?: string): Promise<Array<{ id: number; title: string; description?: string; created_by?: string; source: string; url: string; created_at: string }>> {
    const query = createdBy ? `?created_by=${encodeURIComponent(createdBy)}` : '';
    return this.request(`/videos${query}`);
  }

  async createVideo(params: { title: string; description?: string; created_by?: string; source: 'upload' | 'url'; url: string }) {
    return this.request('/videos', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Audios API
  async getAudios(createdBy?: string): Promise<Array<{ id: number; title: string; description?: string; created_by?: string; source: string; url: string; created_at: string }>> {
    const query = createdBy ? `?created_by=${encodeURIComponent(createdBy)}` : '';
    return this.request(`/audios${query}`);
  }

  async createAudio(params: { title: string; description?: string; created_by?: string; source: 'upload' | 'url'; url: string }) {
    return this.request('/audios', {
      method: 'POST',
      body: JSON.stringify(params),
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
