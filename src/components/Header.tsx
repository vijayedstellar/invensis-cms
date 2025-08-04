import React from 'react';
import { ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Template Management</h1>
          <p className="text-gray-600">Manage your global training content</p>
        </div>
        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-50">
          <img 
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDA1MkNDIi8+CjxyZWN0IHk9IjgiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHk9IjE2IiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgZmlsbD0iI0NDMTQyQiIvPgo8L3N2Zz4K"
            alt="UK Flag"
            className="w-5 h-4"
          />
          <span className="text-sm font-medium text-gray-700">United Kingdom</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </div>
  );
};

export default Header;