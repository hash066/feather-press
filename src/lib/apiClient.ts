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
  tags?: string;
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
  likes?: number;
  created_at: string;
  updated_at: string;
}

export interface AudioItem {
  id: number;
  title: string;
  description?: string;
  created_by?: string;
  source: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface PhotoItem {
  id: number;
  title: string;
  url: string;
  description?: string;
  photographer?: string; // display name
  created_by?: string;   // username
  category?: string;
  tags?: string;
  likes?: number;
  views?: number;
  downloads?: number;
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

  // Quote likes
  async likeQuote(id: number): Promise<{ likes: number }> {
    return this.request<{ likes: number }>(`/quotes/${id}/like`, { method: 'POST' });
  }

  async unlikeQuote(id: number): Promise<{ likes: number }> {
    return this.request<{ likes: number }>(`/quotes/${id}/unlike`, { method: 'POST' });
  }

  async getPost(id: number): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(title: string, content: string, image_url?: string, author?: string, tags?: string): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify({ title, content, image_url, author, tags }),
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

  // Generic Comments API - works with any content type
  async getComments(contentType: 'posts' | 'quotes' | 'videos' | 'galleries', contentId: number): Promise<Array<{ id: number; content_type: string; content_id: number; author?: string; text: string; created_at: string }>> {
    return this.request(`/${contentType}/${contentId}/comments`);
  }

  async addComment(contentType: 'posts' | 'quotes' | 'videos' | 'galleries', contentId: number, text: string, author?: string) {
    return this.request(`/${contentType}/${contentId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text, author }),
    });
  }

  // Legacy method for backward compatibility
  async getPostComments(postId: number): Promise<Array<{ id: number; post_id: number; author?: string; text: string; created_at: string }>> {
    return this.getComments('posts', postId);
  }

  async addPostComment(postId: number, text: string, author?: string) {
    return this.addComment('posts', postId, text, author);
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
  async getGalleries(createdBy?: string): Promise<Array<{ id: number; title: string; description?: string; created_by?: string; images: string; tags?: string; created_at: string }>> {
    const query = createdBy ? `?created_by=${encodeURIComponent(createdBy)}` : '';
    return this.request(`/galleries${query}`);
  }

  async createGallery(params: { title: string; description?: string; created_by?: string; images: Array<{ url: string }>; tags?: string }): Promise<{ id: number } & Record<string, any>> {
    return this.request('/galleries', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Gallery likes
  async likeGallery(id: number): Promise<{ likes: number }> {
    return this.request<{ likes: number }>(`/galleries/${id}/like`, { method: 'POST' });
  }

  async unlikeGallery(id: number): Promise<{ likes: number }> {
    return this.request<{ likes: number }>(`/galleries/${id}/unlike`, { method: 'POST' });
  }

  async listUploads(): Promise<{ files: Array<{ name: string; url: string; size: number; mtime: number }> }> {
    return this.request('/uploads');
  }

  // Videos API
  async getVideos(createdBy?: string): Promise<Array<{ id: number; title: string; description?: string; created_by?: string; source: string; url: string; tags?: string; created_at: string }>> {
    const query = createdBy ? `?created_by=${encodeURIComponent(createdBy)}` : '';
    return this.request(`/videos${query}`);
  }

  async createVideo(params: { title: string; description?: string; created_by?: string; source: 'upload' | 'url'; url: string; tags?: string }) {
    return this.request('/videos', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Video likes
  async likeVideo(id: number): Promise<{ likes: number }> {
    return this.request<{ likes: number }>(`/videos/${id}/like`, { method: 'POST' });
  }

  async unlikeVideo(id: number): Promise<{ likes: number }> {
    return this.request<{ likes: number }>(`/videos/${id}/unlike`, { method: 'POST' });
  }

  // Audios API removed
  // Audios API
  async getAudios(createdBy?: string): Promise<AudioItem[]> {
    const query = createdBy ? `?created_by=${encodeURIComponent(createdBy)}` : '';
    return this.request<AudioItem[]>(`/audios${query}`);
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
