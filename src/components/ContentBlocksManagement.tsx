import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Eye } from 'lucide-react';

interface ContentBlock {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: string;
  category: string;
  usageCount: number;
  lastUpdated: string;
  isCustom: boolean;
}

const ContentBlocksManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs = [
    { id: 'all', label: 'All Blocks' },
    { id: 'custom', label: 'Custom Blocks' },
    { id: 'system', label: 'System Blocks' }
  ];

  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    // System blocks
    {
      id: 'hero',
      name: 'Hero Section',
      type: 'hero',
      description: 'Banner with title, subtitle and call-to-action button',
      icon: '🎯',
      category: 'Headers',
      usageCount: 45,
      lastUpdated: '2 days ago',
      isCustom: false
    },
    {
      id: 'course-grid',
      name: 'Course Grid',
      type: 'course-grid',
      description: 'Grid layout displaying course cards with pricing',
      icon: '📚',
      category: 'Content',
      usageCount: 32,
      lastUpdated: '1 week ago',
      isCustom: false
    },
    {
      id: 'pricing',
      name: 'Pricing Table',
      type: 'pricing',
      description: 'Pricing plans with features and call-to-action',
      icon: '💰',
      category: 'Commerce',
      usageCount: 28,
      lastUpdated: '3 days ago',
      isCustom: false
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      type: 'testimonials',
      description: 'Customer reviews and testimonials grid',
      icon: '💬',
      category: 'Social Proof',
      usageCount: 19,
      lastUpdated: '5 days ago',
      isCustom: false
    },
    {
      id: 'cta',
      name: 'CTA Section',
      type: 'cta',
      description: 'Call-to-action section with button',
      icon: '🚀',
      category: 'Actions',
      usageCount: 41,
      lastUpdated: '1 week ago',
      isCustom: false
    },
    // Custom blocks
    {
      id: 'instructor-bio',
      name: 'Instructor Bio',
      type: 'instructor-bio',
      description: 'Instructor profile with photo, bio and credentials',
      icon: '👨‍🏫',
      category: 'Content',
      usageCount: 12,
      lastUpdated: '2 weeks ago',
      isCustom: true
    },
    {
      id: 'certification-badges',
      name: 'Certification Badges',
      type: 'certification-badges',
      description: 'Display certification logos and accreditation badges',
      icon: '🏆',
      category: 'Social Proof',
      usageCount: 8,
      lastUpdated: '1 month ago',
      isCustom: true
    },
    {
      id: 'learning-path',
      name: 'Learning Path',
      type: 'learning-path',
      description: 'Visual learning journey with progress indicators',
      icon: '🛤️',
      category: 'Content',
      usageCount: 15,
      lastUpdated: '3 weeks ago',
      isCustom: true
    }
  ]);

  const getFilteredBlocks = () => {
    if (activeTab === 'all') return contentBlocks;
    if (activeTab === 'custom') return contentBlocks.filter(block => block.isCustom);
    if (activeTab === 'system') return contentBlocks.filter(block => !block.isCustom);
    return contentBlocks;
  };

  const filteredBlocks = getFilteredBlocks();

  const handleCreateBlock = () => {
    setShowCreateModal(true);
  };

  const handleDuplicateBlock = (blockId: string) => {
    const blockToDuplicate = contentBlocks.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const newBlock: ContentBlock = {
        ...blockToDuplicate,
        id: `${blockToDuplicate.id}-copy-${Date.now()}`,
        name: `${blockToDuplicate.name} (Copy)`,
        usageCount: 0,
        lastUpdated: 'Just now',
        isCustom: true
      };
      setContentBlocks([...contentBlocks, newBlock]);
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    setContentBlocks(contentBlocks.filter(block => block.id !== blockId));
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Content Blocks</h1>
            <p className="text-gray-600">Create and manage reusable content blocks for your templates</p>
          </div>
          <button 
            onClick={handleCreateBlock}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Block</span>
          </button>
        </div>

        <div className="mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlocks.map((block) => (
            <div key={block.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{block.icon}</span>
                  <div>
                    <span className="text-sm text-purple-600 font-medium">{block.category}</span>
                    {block.isCustom && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  <Copy 
                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600"
                    onClick={() => handleDuplicateBlock(block.id)}
                  />
                  {block.isCustom && (
                    <Trash2 
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-600"
                      onClick={() => handleDeleteBlock(block.id)}
                    />
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{block.name}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{block.description}</p>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Used in: {block.usageCount} templates</span>
                <span>Updated: {block.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Block Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Content Block</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Block Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter block name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe what this block does"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Headers</option>
                  <option>Content</option>
                  <option>Commerce</option>
                  <option>Social Proof</option>
                  <option>Actions</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="🎯"
                  maxLength={2}
                />
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
                Create Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentBlocksManagement;