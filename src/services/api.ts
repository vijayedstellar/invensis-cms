// API service for making HTTP requests to backend

const API_BASE_URL = ''; // Always use relative URLs for Vercel deployment

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
      
      console.log('Making API request:', {
        method: options.method || 'GET',
        url: url,
        hasBody: !!options.body
      });
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('API response status:', response.status, response.statusText);

      const data = await response.json();
      
      console.log('API response data:', {
        success: data.success,
        hasData: !!data.data,
        error: data.error
      });

      if (!response.ok) {
        console.error('API request failed:', {
          status: response.status,
          error: data.error,
          details: data.details
        });
        throw new Error(data.error || data.details || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error('API request error:', error);
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