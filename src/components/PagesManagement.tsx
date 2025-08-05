import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Globe, Search, Filter, Plus } from 'lucide-react';
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

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([]);
  const [filteredPages, setFilteredPages] = useState<Page[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setFilteredPages(formattedPages);
      } else {
        // Fallback to localStorage if API fails
        console.warn('API failed, falling back to localStorage:', response.error);
        const localPages = JSON.parse(localStorage.getItem('createdPages') || '[]');
        setPages(localPages);
        setFilteredPages(localPages);
        setError('Using offline data - some features may be limited');
      }
    } catch (error: any) {
      console.error('Failed to load pages:', error);
      // Fallback to localStorage
      const localPages = JSON.parse(localStorage.getItem('createdPages') || '[]');
      setPages(localPages);
      setFilteredPages(localPages);
      setError('Failed to connect to server - using offline data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    const filtered = pages.filter(page => {
      const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           page.slug.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredPages(filtered);
  }, [pages, searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await apiService.deletePage(id);
        
        if (response.success) {
          const updatedPages = pages.filter(page => page.id !== id);
          setPages(updatedPages);
          localStorage.setItem('createdPages', JSON.stringify(updatedPages));
          
          // Update filtered pages
          setFilteredPages(updatedPages.filter(page => 
            (statusFilter === 'all' || page.status === statusFilter) &&
            (page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             page.slug.toLowerCase().includes(searchTerm.toLowerCase()))
          ));
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
        localStorage.setItem('createdPages', JSON.stringify(updatedPages));
        
        // Update filtered pages
        setFilteredPages(updatedPages.filter(page => 
          (statusFilter === 'all' || page.status === statusFilter) &&
          (page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           page.slug.toLowerCase().includes(searchTerm.toLowerCase()))
        ));
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

  const getStatusColor = (status: string) => {
    return status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pages Management</h1>
        {error && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
            {error}
          </div>
        )}
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Create New Page
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'draft' | 'published')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pages List */}
      {filteredPages.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
          <p className="text-gray-600">
            {pages.length === 0 ? 'Create your first page to get started.' : 'Try adjusting your search or filter criteria.'}
            {isLoading && <span className="ml-2 text-blue-600">Loading...</span>}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{page.title}</div>
                        <div className="text-sm text-gray-500">{page.slug}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          <a href={page.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {page.url}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={page.status}
                        onChange={(e) => handleStatusChange(page.id, e.target.value as 'draft' | 'published')}
                        disabled={isLoading}
                        className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(page.status)}`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{page.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(page.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{page.views}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(page.url, '_blank')}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Page"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-800"
                          title="Edit Page"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-800"
                          title="Delete Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}