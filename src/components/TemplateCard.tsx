import React from 'react';
import { Edit2, Eye } from 'lucide-react';

interface TemplateCardProps {
  category: string;
  title: string;
  description: string;
  variables: string[];
  usedInCountries: number;
  lastUpdated: string;
  onEdit?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  category,
  title,
  description,
  variables,
  usedInCountries,
  lastUpdated,
  onEdit
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-sm text-purple-600 font-medium">{category}</span>
        <div className="flex space-x-2">
          <Edit2 
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" 
            onClick={onEdit}
          />
          <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {variables.map((variable, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full border border-orange-200"
          >
            {variable}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Used in: {usedInCountries} countries</span>
        <span>Updated: {lastUpdated}</span>
      </div>
    </div>
  );
};

export default TemplateCard;