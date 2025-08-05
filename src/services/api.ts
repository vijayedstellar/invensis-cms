// API service for making HTTP requests to backend

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production (same domain)
  : 'http://localhost:3000'; // Use localhost in development

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}/api${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error.message || 'Network error occurred'
      };
    }
  }

  // Pages API
  async getPages() {
    return this.request<any[]>('/pages');
  }

  async getPage(id: string) {
    return this.request<any>(`/pages/${id}`);
  }

  async createPage(pageData: any) {
    return this.request<any>('/pages', {
      method: 'POST',
      body: JSON.stringify(pageData),
    });
  }

  async updatePage(id: string, pageData: any) {
    return this.request<any>(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pageData),
    });
  }

  async deletePage(id: string) {
    return this.request<any>(`/pages/${id}`, {
      method: 'DELETE',
    });
  }

  // Settings API
  async getSettings() {
    return this.request<any>('/settings');
  }

  async updateSettings(settingsData: any) {
    return this.request<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  }
}

export const apiService = new ApiService();