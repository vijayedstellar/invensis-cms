import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit2, Trash2, Eye, Globe, Calendar, User, MoreVertical } from 'lucide-react';

interface Page {
  id: string;
  title: string;
  slug: string;
  description: string;
  h1: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdDate: string;
  lastModified: string;
  views: number;
  url: string;
}

const PagesManagement: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastModified');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Load pages from localStorage on component mount
  useEffect(() => {
    const loadPages = () => {
      const savedPages = localStorage.getItem('createdPages');
      if (savedPages) {
        setPages(JSON.parse(savedPages));
      }
    };

    loadPages();

    // Listen for new pages being created
    const handlePageCreated = (event: CustomEvent) => {
      loadPages(); // Reload pages when a new one is created
    };

    window.addEventListener('pageCreated', handlePageCreated as EventListener);

    return () => {
      window.removeEventListener('pageCreated', handlePageCreated as EventListener);
    };
  }, []);

  const getFilteredPages = () => {
    let filtered = pages;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(page => page.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(page =>
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort pages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdDate':
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
        case 'views':
          return b.views - a.views;
        case 'lastModified':
        default:
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      }
    });

    return filtered;
  };

  const handleDeletePage = (pageId: string) => {
    if (window.confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      const updatedPages = pages.filter(page => page.id !== pageId);
      setPages(updatedPages);
      localStorage.setItem('createdPages', JSON.stringify(updatedPages));
    }
  };

  const handleStatusChange = (pageId: string, newStatus: 'draft' | 'published' | 'archived') => {
    const updatedPages = pages.map(page =>
      page.id === pageId
        ? { ...page, status: newStatus, lastModified: new Date().toISOString() }
        : page
    );
    setPages(updatedPages);
    localStorage.setItem('createdPages', JSON.stringify(updatedPages));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return '🟢';
      case 'draft':
        return '🟡';
      case 'archived':
        return '⚫';
      default:
        return '⚪';
    }
  };

  const filteredPages = getFilteredPages();

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Pages</h1>
            <p className="text-gray-600">View and manage all your created pages</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="lastModified">Last Modified</option>
                  <option value="createdDate">Created Date</option>
                  <option value="title">Title</option>
                  <option value="views">Views</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredPages.length} of {pages.length} pages
          </p>
          <p className="text-sm text-gray-600">
            Total Views: {pages.reduce((sum, page) => sum + page.views, 0)}
          </p>
        </div>

        {/* Pages List/Grid */}
        {filteredPages.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {pages.length === 0 ? 'No pages created yet' : 'No pages found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {pages.length === 0 
                ? 'Create your first page using the Create Pages menu.' 
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{page.title}</div>
                          <div className="text-sm text-gray-500">{page.description}</div>
                          <div className="text-xs text-blue-600 mt-1">
                            <a href={page.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {page.url}
                            </a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{getStatusIcon(page.status)}</span>
                          <select
                            value={page.status}
                            onChange={(e) => handleStatusChange(page.id, e.target.value as any)}
                            className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(page.status)}`}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{page.author}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {new Date(page.createdDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{page.views.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            title="View Page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-800"
                            title="Edit Page"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePage(page.id)}
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <div key={page.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{getStatusIcon(page.status)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(page.status)}`}>
                      {page.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    <Trash2 
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-600"
                      onClick={() => handleDeletePage(page.id)}
                    />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{page.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{page.description}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-between">
                    <span>Author:</span>
                    <span className="text-gray-900">{page.author}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Created:</span>
                    <span className="text-gray-900">{new Date(page.createdDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Views:</span>
                    <span className="text-gray-900">{page.views.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <a 
                    href={page.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline break-all"
                  >
                    {page.url}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PagesManagement;