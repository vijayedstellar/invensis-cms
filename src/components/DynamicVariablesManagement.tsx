import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Search, Filter, Code, Globe, User, Building, Calendar, DollarSign, Settings } from 'lucide-react';

interface DynamicVariable {
  id: string;
  key: string;
  name: string;
  description: string;
  category: string;
  dataType: 'text' | 'number' | 'boolean' | 'date' | 'url' | 'email';
  defaultValue: string;
  isRequired: boolean;
  isGlobal: boolean;
  usageCount: number;
  lastUpdated: string;
  examples: string[];
}

const DynamicVariablesManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { id: 'all', label: 'All Variables' },
    { id: 'global', label: 'Global Variables' },
    { id: 'location', label: 'Location Variables' },
    { id: 'course', label: 'Course Variables' }
  ];

  const categories = [
    { id: 'all', label: 'All Categories', icon: Settings },
    { id: 'company', label: 'Company', icon: Building },
    { id: 'location', label: 'Location', icon: Globe },
    { id: 'course', label: 'Course', icon: Code },
    { id: 'user', label: 'User', icon: User },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'date', label: 'Date/Time', icon: Calendar }
  ];

  const [dynamicVariables, setDynamicVariables] = useState<DynamicVariable[]>([
    // Company Variables
    {
      id: 'company_name',
      key: '{{company_name}}',
      name: 'Company Name',
      description: 'The brand name of the training company',
      category: 'company',
      dataType: 'text',
      defaultValue: 'Invensis Learning',
      isRequired: true,
      isGlobal: true,
      usageCount: 156,
      lastUpdated: '2024-01-15',
      examples: ['Invensis Learning', 'Training Corp', 'EduTech Solutions']
    },
    {
      id: 'company_logo',
      key: '{{company_logo}}',
      name: 'Company Logo URL',
      description: 'URL to the company logo image',
      category: 'company',
      dataType: 'url',
      defaultValue: '/assets/logo.png',
      isRequired: false,
      isGlobal: true,
      usageCount: 89,
      lastUpdated: '2024-01-12',
      examples: ['/assets/logo.png', 'https://cdn.company.com/logo.svg']
    },
    // Location Variables
    {
      id: 'country',
      key: '{{country}}',
      name: 'Country',
      description: 'Target country for localization',
      category: 'location',
      dataType: 'text',
      defaultValue: 'United States',
      isRequired: true,
      isGlobal: false,
      usageCount: 234,
      lastUpdated: '2024-01-20',
      examples: ['United States', 'United Kingdom', 'Canada', 'Australia']
    },
    {
      id: 'city',
      key: '{{city}}',
      name: 'City',
      description: 'Primary city for training delivery',
      category: 'location',
      dataType: 'text',
      defaultValue: 'New York',
      isRequired: true,
      isGlobal: false,
      usageCount: 198,
      lastUpdated: '2024-01-18',
      examples: ['New York', 'London', 'Toronto', 'Sydney']
    },
    {
      id: 'currency',
      key: '{{currency}}',
      name: 'Currency Symbol',
      description: 'Local currency symbol for pricing',
      category: 'pricing',
      dataType: 'text',
      defaultValue: '$',
      isRequired: true,
      isGlobal: false,
      usageCount: 167,
      lastUpdated: '2024-01-16',
      examples: ['$', '£', '€', '₹', '¥']
    },
    // Course Variables
    {
      id: 'category_name',
      key: '{{category_name}}',
      name: 'Category Name',
      description: 'Training category or course type',
      category: 'course',
      dataType: 'text',
      defaultValue: 'DevOps',
      isRequired: true,
      isGlobal: false,
      usageCount: 145,
      lastUpdated: '2024-01-22',
      examples: ['DevOps', 'Project Management', 'Cloud Computing', 'Data Science']
    },
    {
      id: 'course_count',
      key: '{{course_count}}',
      name: 'Course Count',
      description: 'Number of courses in category',
      category: 'course',
      dataType: 'text',
      defaultValue: '25+',
      isRequired: false,
      isGlobal: false,
      usageCount: 78,
      lastUpdated: '2024-01-14',
      examples: ['25+', '15 courses', '30+ programs']
    },
    {
      id: 'price',
      key: '{{price}}',
      name: 'Course Price',
      description: 'Course price in local currency',
      category: 'pricing',
      dataType: 'text',
      defaultValue: '2,499',
      isRequired: false,
      isGlobal: false,
      usageCount: 134,
      lastUpdated: '2024-01-19',
      examples: ['2,499', '1,899', '3,299', '999']
    },
    // User Variables
    {
      id: 'user_name',
      key: '{{user_name}}',
      name: 'User Name',
      description: 'Name of the current user or learner',
      category: 'user',
      dataType: 'text',
      defaultValue: 'Professional',
      isRequired: false,
      isGlobal: false,
      usageCount: 67,
      lastUpdated: '2024-01-10',
      examples: ['John Smith', 'Professional', 'Learner']
    },
    // Date Variables
    {
      id: 'current_year',
      key: '{{current_year}}',
      name: 'Current Year',
      description: 'Current year for copyright and dates',
      category: 'date',
      dataType: 'number',
      defaultValue: '2024',
      isRequired: false,
      isGlobal: true,
      usageCount: 203,
      lastUpdated: '2024-01-01',
      examples: ['2024', '2025']
    }
  ]);

  const getFilteredVariables = () => {
    let filtered = dynamicVariables;

    // Filter by tab
    if (activeTab === 'global') {
      filtered = filtered.filter(variable => variable.isGlobal);
    } else if (activeTab === 'location') {
      filtered = filtered.filter(variable => variable.category === 'location');
    } else if (activeTab === 'course') {
      filtered = filtered.filter(variable => variable.category === 'course');
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(variable => variable.category === categoryFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(variable =>
        variable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        variable.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredVariables = getFilteredVariables();

  const handleCreateVariable = () => {
    setShowCreateModal(true);
  };

  const handleDuplicateVariable = (variableId: string) => {
    const variableToDuplicate = dynamicVariables.find(variable => variable.id === variableId);
    if (variableToDuplicate) {
      const newVariable: DynamicVariable = {
        ...variableToDuplicate,
        id: `${variableToDuplicate.id}_copy_${Date.now()}`,
        key: `{{${variableToDuplicate.id}_copy}}`,
        name: `${variableToDuplicate.name} (Copy)`,
        usageCount: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        isGlobal: false
      };
      setDynamicVariables([...dynamicVariables, newVariable]);
    }
  };

  const handleDeleteVariable = (variableId: string) => {
    if (window.confirm('Are you sure you want to delete this variable? This action cannot be undone.')) {
      setDynamicVariables(dynamicVariables.filter(variable => variable.id !== variableId));
    }
  };

  const getDataTypeIcon = (dataType: string) => {
    switch (dataType) {
      case 'text': return '📝';
      case 'number': return '🔢';
      case 'boolean': return '✅';
      case 'date': return '📅';
      case 'url': return '🔗';
      case 'email': return '📧';
      default: return '📝';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(cat => cat.id === category);
    return categoryObj ? categoryObj.icon : Settings;
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dynamic Variables</h1>
            <p className="text-gray-600">Manage reusable variables for templates and content blocks</p>
          </div>
          <button 
            onClick={handleCreateVariable}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Variable</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search variables..."
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
            Showing {filteredVariables.length} of {dynamicVariables.length} variables
          </p>
          <p className="text-sm text-gray-600">
            Total Usage: {filteredVariables.reduce((sum, variable) => sum + variable.usageCount, 0)} references
          </p>
        </div>

        {/* Variables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVariables.map((variable) => {
            const CategoryIcon = getCategoryIcon(variable.category);
            return (
              <div key={variable.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-600 font-medium capitalize">{variable.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {variable.isGlobal && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Global
                        </span>
                      )}
                      {variable.isRequired && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    <Copy 
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                      onClick={() => handleDuplicateVariable(variable.id)}
                      title="Duplicate Variable"
                    />
                    <Trash2 
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-600"
                      onClick={() => handleDeleteVariable(variable.id)}
                      title="Delete Variable"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{variable.name}</h3>
                  <code className="text-sm bg-gray-100 text-purple-700 px-2 py-1 rounded font-mono">
                    {variable.key}
                  </code>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{variable.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Data Type:</span>
                    <div className="flex items-center space-x-1">
                      <span>{getDataTypeIcon(variable.dataType)}</span>
                      <span className="text-gray-900 capitalize">{variable.dataType}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Default Value:</span>
                    <span className="text-gray-900 font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                      {variable.defaultValue}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Usage Count:</span>
                    <span className="text-gray-900 font-semibold">{variable.usageCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="text-gray-900">{new Date(variable.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {variable.examples.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">Examples:</p>
                    <div className="flex flex-wrap gap-1">
                      {variable.examples.slice(0, 3).map((example, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredVariables.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No variables found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Create your first dynamic variable to get started.'}
            </p>
            <button 
              onClick={handleCreateVariable}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Create Variable
            </button>
          </div>
        )}
      </div>

      {/* Create Variable Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Variable</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Variable Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Course Duration"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Variable Key</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="e.g., {{course_duration}}"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe what this variable represents"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="company">Company</option>
                    <option value="location">Location</option>
                    <option value="course">Course</option>
                    <option value="user">User</option>
                    <option value="pricing">Pricing</option>
                    <option value="date">Date/Time</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                    <option value="url">URL</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Value</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter default value"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Required</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Global Variable</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Variable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicVariablesManagement;