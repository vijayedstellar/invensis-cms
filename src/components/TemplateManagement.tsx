import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TemplateCard from './TemplateCard';
import VisualPageBuilder from './VisualPageBuilder';

const TemplateManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const tabs = [
    { id: 'all', label: 'All Templates' },
    { id: 'home', label: 'Home Pages' },
    { id: 'category', label: 'Category Pages' },
    { id: 'course', label: 'Course Pages' }
  ];

  const allTemplates = [
    // Home Page Templates
    {
      type: 'home',
      category: 'Home Page',
      title: 'Corporate Training Hub',
      description: 'Main landing page template for corporate training programs and enterprise solutions',
      variables: ['{{company_name}}', '{{featured_courses}}', '{{testimonials}}', '{{locations}}'],
      usedInCountries: 89,
      lastUpdated: '2 days ago'
    },
    {
      type: 'home',
      category: 'Home Page',
      title: 'Individual Learner Portal',
      description: 'Homepage template designed for individual professionals seeking certification',
      variables: ['{{user_name}}', '{{recommended_courses}}', '{{progress_stats}}', '{{achievements}}'],
      usedInCountries: 67,
      lastUpdated: '5 days ago'
    },
    {
      type: 'home',
      category: 'Home Page',
      title: 'Regional Training Center',
      description: 'Localized homepage template for regional training centers and local partnerships',
      variables: ['{{region_name}}', '{{local_courses}}', '{{center_info}}', '{{contact_details}}'],
      usedInCountries: 34,
      lastUpdated: '1 week ago'
    },
    // Category Page Templates
    {
      type: 'category',
      category: 'Category Page',
      title: 'DevOps Training',
      description: 'Category page template for DevOps and automation courses',
      variables: ['{{category_name}}', '{{course_count}}', '{{featured_courses}}'],
      usedInCountries: 45,
      lastUpdated: '1 week ago'
    },
    {
      type: 'category',
      category: 'Category Page',
      title: 'Quality Management',
      description: 'Quality assurance and management certification category',
      variables: ['{{category_name}}', '{{standards}}', '{{industry_focus}}'],
      usedInCountries: 56,
      lastUpdated: '2 weeks ago'
    },
    {
      type: 'category',
      category: 'Category Page',
      title: 'Project Management',
      description: 'PMP, PRINCE2, and agile project management courses',
      variables: ['{{category_name}}', '{{certifications}}', '{{course_levels}}'],
      usedInCountries: 78,
      lastUpdated: '3 days ago'
    },
    {
      type: 'category',
      category: 'Category Page',
      title: 'IT Service Management',
      description: 'ITIL, COBIT, and IT governance certification programs',
      variables: ['{{category_name}}', '{{frameworks}}', '{{certification_levels}}', '{{exam_info}}'],
      usedInCountries: 62,
      lastUpdated: '4 days ago'
    },
    // Course Page Templates
    {
      type: 'course',
      category: 'Course Page',
      title: 'PMP Certification Course',
      description: 'Individual course page template for Project Management Professional certification',
      variables: ['{{course_name}}', '{{duration}}', '{{price}}', '{{instructor}}', '{{schedule}}'],
      usedInCountries: 92,
      lastUpdated: '3 days ago'
    },
    {
      type: 'course',
      category: 'Course Page',
      title: 'AWS Solutions Architect',
      description: 'Cloud certification course template with hands-on labs and practice exams',
      variables: ['{{course_name}}', '{{cloud_provider}}', '{{lab_access}}', '{{exam_voucher}}'],
      usedInCountries: 78,
      lastUpdated: '1 week ago'
    },
    {
      type: 'course',
      category: 'Course Page',
      title: 'Six Sigma Green Belt',
      description: 'Quality management course template with case studies and project work',
      variables: ['{{course_name}}', '{{belt_level}}', '{{project_requirements}}', '{{tools_included}}'],
      usedInCountries: 54,
      lastUpdated: '5 days ago'
    },
    {
      type: 'course',
      category: 'Course Page',
      title: 'Scrum Master Certification',
      description: 'Agile methodology course template with interactive workshops and simulations',
      variables: ['{{course_name}}', '{{methodology}}', '{{workshop_count}}', '{{simulation_access}}'],
      usedInCountries: 71,
      lastUpdated: '2 weeks ago'
    }
  ];

  const getFilteredTemplates = () => {
    if (activeTab === 'all') return allTemplates;
    return allTemplates.filter(template => template.type === activeTab);
  };

  const templates = getFilteredTemplates();

  const handleEditTemplate = (templateTitle: string) => {
    setEditingTemplate(templateTitle);
  };

  const handleCloseEditor = () => {
    setEditingTemplate(null);
  };

  if (editingTemplate) {
    return (
      <VisualPageBuilder 
        templateTitle={editingTemplate}
        onClose={handleCloseEditor}
      />
    );
  }

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Template Management</h1>
            <p className="text-gray-600">Master templates with dynamic variables for global deployment</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Template</span>
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
          {templates.map((template, index) => (
            <TemplateCard
              key={index}
              category={template.category}
              title={template.title}
              description={template.description}
              variables={template.variables}
              usedInCountries={template.usedInCountries}
              lastUpdated={template.lastUpdated}
              onEdit={() => handleEditTemplate(template.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateManagement;