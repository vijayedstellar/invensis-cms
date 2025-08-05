import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Globe, Save, X } from 'lucide-react';
import { apiService } from '../services/api';

interface Page {
  id: string;
  title: string;
  slug: string;
  description: string;
  h1: string;
  content: string;
  status: 'draft' | 'published';
  author: string;
  createdDate: string;
  lastModified: string;
  views: number;
  url: string;
}

export default function CreatePagesManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPage, setNewPage] = useState<Omit<Page, 'id' | 'createdDate' | 'lastModified' | 'views' | 'url'>>({
    title: '',
    slug: '',
    description: '',
    h1: '',
    content: '',
    status: 'draft',
    author: 'Current User'
  });

  // Load pages from storage
  const loadPages = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getPages();
      
      if (response.success && response.data) {
        // Convert API response to match expected format
        const formattedPages = response.data.map((page: any) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          description: page.description || '',
          h1: page.h1 || '',
          content: page.content || '',
          status: page.status as 'draft' | 'published',
          author: page.author || 'Unknown',
          createdDate: page.createdAt || new Date().toISOString(),
          lastModified: page.updatedAt || new Date().toISOString(),
          views: page.views || 0,
          url: page.url || `/${page.slug}`
        }));
        
        setPages(formattedPages);
      } else {
        // Fallback to localStorage if API fails
        console.warn('API failed, falling back to localStorage:', response.error);
        const localPages = JSON.parse(localStorage.getItem('createdPages') || '[]');
        setPages(localPages);
        setError('Using offline data - some features may be limited');
      }
    } catch (error: any) {
      console.error('Failed to load pages:', error);
      // Fallback to localStorage
      const localPages = JSON.parse(localStorage.getItem('createdPages') || '[]');
      setPages(localPages);
      setError('Failed to connect to server - using offline data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPages();

    // Listen for page creation events from other components
    const handlePageCreated = (event: CustomEvent) => {
      loadPages(); // Reload pages when a new page is created
    };

    window.addEventListener('pageCreated', handlePageCreated as EventListener);

    return () => {
      window.removeEventListener('pageCreated', handlePageCreated as EventListener);
    };
  }, []);

  const handleInputChange = (field: keyof typeof newPage, value: string) => {
    setNewPage(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setNewPage(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleSave = async () => {
    if (newPage.title && newPage.slug) {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiService.createPage({
          title: newPage.title,
          slug: newPage.slug,
          description: newPage.description,
          h1: newPage.h1,
          content: newPage.content,
          status: newPage.status,
          author: newPage.author
        });
        
        if (response.success && response.data) {
          // Add new page to local state
          const formattedPage: Page = {
            id: response.data.id,
            title: response.data.title,
            slug: response.data.slug,
            description: response.data.description || '',
            h1: response.data.h1 || '',
            content: response.data.content || '',
            status: response.data.status as 'draft' | 'published',
            author: response.data.author || 'Unknown',
            createdDate: response.data.createdAt || new Date().toISOString(),
            lastModified: response.data.updatedAt || new Date().toISOString(),
            views: response.data.views || 0,
            url: response.data.url || `/${response.data.slug}`
          };
          
          setPages([formattedPage, ...pages]);
          
          // Also save to localStorage as backup
          const updatedPages = [formattedPage, ...pages];
          localStorage.setItem('createdPages', JSON.stringify(updatedPages));
          
          // Reset form
          setIsCreating(false);
          setNewPage({
            title: '',
            slug: '',
            description: '',
            h1: '',
            content: '',
            status: 'draft',
            author: 'Current User'
          });
        } else {
          setError(response.error || 'Failed to create page');
        }
      } catch (error: any) {
        console.error('Failed to create page:', error);
        setError('Failed to create page - please try again');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiService.deletePage(id);
        
        if (response.success) {
          const updatedPages = pages.filter(page => page.id !== id);
          setPages(updatedPages);
          
          // Also update localStorage
          localStorage.setItem('createdPages', JSON.stringify(updatedPages));
        } else {
          setError(response.error || 'Failed to delete page');
        }
      } catch (error: any) {
        console.error('Failed to delete page:', error);
        setError('Failed to delete page - please try again');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'draft' | 'published') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.updatePage(id, { status: newStatus });
      
      if (response.success && response.data) {
        const updatedPages = pages.map(page => 
          page.id === id ? { 
            ...page, 
            status: newStatus, 
            lastModified: response.data.updatedAt || new Date().toISOString() 
          } : page
        );
        setPages(updatedPages);
        
        // Also update localStorage
        localStorage.setItem('createdPages', JSON.stringify(updatedPages));
      } else {
        setError(response.error || 'Failed to update page status');
      }
    } catch (error: any) {
      console.error('Failed to update page status:', error);
      setError('Failed to update page status - please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pages Management</h1>
            <p className="text-gray-600">Create and manage your website pages</p>
            {error && (
              <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
                {error}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCreating(true)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isLoading ? 'Loading...' : 'Create New Page'}</span>
          </button>
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Create New Page</h2>
              <button
                onClick={() => setIsCreating(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter page title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={newPage.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="page-url-slug"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newPage.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the page"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Heading (H1)
                </label>
                <input
                  type="text"
                  value={newPage.h1}
                  onChange={(e) => handleInputChange('h1', e.target.value)}
                  placeholder="Main heading for the page"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newPage.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Page content (supports HTML and markdown)"
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newPage.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={newPage.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Author name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!newPage.title || !newPage.slug}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Saving...' : 'Save Page'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Pages List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Pages ({pages.length})</h2>
            {isLoading && (
              <div className="mt-2 text-sm text-blue-600">Loading pages...</div>
            )}
          </div>

          {pages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pages created yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first page</p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Page</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pages.map((page) => (
                <div key={page.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{page.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          page.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {page.status}
                        </span>
                      </div>
                      
                      {page.description && (
                        <p className="text-gray-600 mb-2">{page.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>/{page.slug}</span>
                        <span>•</span>
                        <span>By {page.author}</span>
                        <span>•</span>
                        <span>Created {formatDate(page.createdDate)}</span>
                        <span>•</span>
                        <span>{page.views} views</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <select
                        value={page.status}
                        onChange={(e) => handleStatusChange(page.id, e.target.value as 'draft' | 'published')}
                        disabled={isLoading}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                      
                      <button
                        onClick={() => window.open(page.url, '_blank')}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Preview page"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit page"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(page.id)}
                        disabled={isLoading}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}