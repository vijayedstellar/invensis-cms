import React from 'react';
import { GraduationCap, BarChart3, FileText, Package, Globe, Code } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Invensis Learning</h1>
            <p className="text-sm text-gray-500">Enterprise CMS</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <div 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer ${
              activeView === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => onViewChange('dashboard')}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </div>
          <div 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer ${
              activeView === 'templates' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => onViewChange('templates')}
          >
            <FileText className="w-5 h-5" />
            <span>Templates</span>
          </div>
          <div 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer ${
              activeView === 'content-blocks' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => onViewChange('content-blocks')}
          >
            <Package className="w-5 h-5" />
            <span>Content Blocks</span>
          </div>
          <div 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer ${
              activeView === 'pages' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => onViewChange('pages')}
          >
            <Globe className="w-5 h-5" />
            <span>Pages</span>
          </div>
          <div 
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer ${
              activeView === 'dynamic-variables' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => onViewChange('dynamic-variables')}
          >
            <Code className="w-5 h-5" />
            <span>Dynamic Variables</span>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;