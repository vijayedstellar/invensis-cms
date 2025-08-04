import React, { useState } from 'react';
import { 
  X, 
  ChevronDown, 
  Plus, 
  Save, 
  Send, 
  Play, 
  Upload,
  ChevronUp,
  Edit3,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Move,
  Settings,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import TestPagePreview from './TestPagePreview';

interface VisualPageBuilderProps {
  templateTitle: string;
  onClose: () => void;
}

interface ContentBlock {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  isActive?: boolean;
}

interface PageBlock {
  id: string;
  type: string;
  title: string;
  content: any;
  isCollapsed?: boolean;
}

const VisualPageBuilder: React.FC<VisualPageBuilderProps> = ({ templateTitle, onClose }) => {
  const [selectedCountry, setSelectedCountry] = useState('United States ($)');
  const [showTestPreview, setShowTestPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('Clipboard');
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [showAddBlockDropdown, setShowAddBlockDropdown] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'India', 'Singapore', 'Japan', 'Netherlands'
  ]);
  const [selectedCities, setSelectedCities] = useState<{[key: string]: string[]}>({
    'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'],
    'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Sheffield', 'Bradford', 'Liverpool'],
    'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Mississauga', 'Winnipeg'],
    'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Newcastle', 'Canberra'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund'],
    'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier'],
    'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'],
    'Singapore': ['Singapore'],
    'Japan': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kyoto'],
    'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere']
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>([
    {
      id: 'hero-1',
      type: 'hero',
      title: 'Hero Section',
      content: {
        title: '{{category_name}} Certification Training',
        subtitle: 'Master {{category_name}} with hands-on training from industry experts.',
        buttonText: 'Get Started'
      }
    },
    {
      id: 'course-grid-1',
      type: 'course-grid',
      title: 'Course Grid',
      content: {
        courses: [
          {
            title: 'Foundation Course',
            duration: '3 days',
            price: '{{currency}}599',
            description: 'Learn More'
          },
          {
            title: 'Advanced Course',
            duration: '5 days',
            price: '{{currency}}899',
            description: 'Learn More'
          }
        ]
      }
    }
  ]);

  const contentBlocks: ContentBlock[] = [
    {
      id: 'hero',
      type: 'hero',
      title: 'Hero Section',
      description: 'Banner with CTA',
      icon: '🎯',
      isActive: true
    },
    {
      id: 'course-grid',
      type: 'course-grid',
      title: 'Course Grid',
      description: 'Display courses',
      icon: '📚'
    },
    {
      id: 'pricing',
      type: 'pricing',
      title: 'Pricing Table',
      description: 'Course pricing',
      icon: '💰'
    },
    {
      id: 'testimonials',
      type: 'testimonials',
      title: 'Testimonials',
      description: 'Customer reviews',
      icon: '💬'
    },
    {
      id: 'hero-2',
      type: 'hero',
      title: 'Hero Section',
      description: 'Banner with CTA',
      icon: '🎯'
    },
    {
      id: 'course-grid-2',
      type: 'course-grid',
      title: 'Course Grid',
      description: 'Display courses',
      icon: '📚'
    },
    {
      id: 'pricing-2',
      type: 'pricing',
      title: 'Pricing Table',
      description: 'Course pricing',
      icon: '💰'
    }
  ];

  // Dynamic variables that would be available in the system
  const allDynamicVariables = [
    { key: '{{category_name}}', description: 'Training category name (e.g., DevOps, PMP, AWS)', example: 'DevOps' },
    { key: '{{company_name}}', description: 'Company brand name', example: 'Invensis Learning' },
    { key: '{{country}}', description: 'Target country for localization', example: 'United States' },
    { key: '{{city}}', description: 'Primary city for training delivery', example: 'New York' },
    { key: '{{currency}}', description: 'Local currency symbol', example: '$' },
    { key: '{{price}}', description: 'Course price in local currency', example: '2,499' },
    { key: '{{course_count}}', description: 'Number of courses in category', example: '25+' },
    { key: '{{duration}}', description: 'Course duration', example: '3 days' },
    { key: '{{instructor}}', description: 'Lead instructor name', example: 'John Smith' },
    { key: '{{schedule}}', description: 'Training schedule', example: 'Weekends Available' },
    { key: '{{certification_body}}', description: 'Certifying organization', example: 'PMI' },
    { key: '{{exam_voucher}}', description: 'Exam voucher inclusion', example: 'Included' },
    { key: '{{lab_access}}', description: 'Hands-on lab access duration', example: '6 months' },
    { key: '{{city_population}}', description: 'City population for context', example: '8.3 million' },
    { key: '{{business_district}}', description: 'Main business area in city', example: 'Manhattan' },
    { key: '{{nearby_cities}}', description: 'Nearby cities/areas served', example: 'Brooklyn, Queens' },
    { key: '{{local_landmarks}}', description: 'Famous local landmarks', example: 'Times Square' },
    { key: '{{transport_hubs}}', description: 'Major transport connections', example: 'Penn Station' },
    { key: '{{training_venues}}', description: 'Number of training venues', example: '5 locations' },
    { key: '{{professionals_trained}}', description: 'Professionals trained in area', example: '50,000+' },
    { key: '{{local_companies}}', description: 'Major local companies', example: 'Goldman Sachs, IBM' },
    { key: '{{timezone}}', description: 'Local timezone', example: 'EST' },
    { key: '{{language}}', description: 'Primary training language', example: 'English' },
    { key: '{{phone}}', description: 'Local contact number', example: '+1-800-555-0123' },
    { key: '{{email}}', description: 'Local contact email', example: 'info.us@invensislearning.com' },
    { key: '{{office_address}}', description: 'Local office address', example: '123 Business Ave, NY' },
    { key: '{{region}}', description: 'Geographic region', example: 'North America' },
    { key: '{{metro_area}}', description: 'Metropolitan area name', example: 'Greater New York' }
  ];

  const tabs = ['Clipboard', 'Image', 'Tools', 'Shapes', 'Colors'];

  const countries = [
    'United States ($)',
    'United Kingdom (£)',
    'Canada (CAD)',
    'Australia (AUD)',
    'Germany (€)',
    'France (€)',
    'India (₹)',
    'Singapore (SGD)',
    'Japan (¥)',
    'Netherlands (€)'
  ];

  const handleAddBlock = (blockType: string) => {
    const newBlock: PageBlock = {
      id: `${blockType}-${Date.now()}`,
      type: blockType,
      title: blockType === 'hero' ? 'Hero Section' : 
             blockType === 'course-grid' ? 'Course Grid' :
             blockType === 'pricing' ? 'Pricing Table' : 'Testimonials',
      content: blockType === 'hero' ? {
        title: '{{category_name}} Certification Training',
        subtitle: 'Master {{category_name}} with hands-on training from industry experts.',
        buttonText: 'Get Started'
      } : blockType === 'course-grid' ? {
        courses: [
          { title: 'Foundation Course', duration: '3 days', price: '{{currency}}599', description: 'Learn More' },
          { title: 'Advanced Course', duration: '5 days', price: '{{currency}}899', description: 'Learn More' }
        ]
      } : {}
    };
    
    setPageBlocks([...pageBlocks, newBlock]);
  };

  const handleDeleteBlock = (blockId: string) => {
    setPageBlocks(pageBlocks.filter(block => block.id !== blockId));
  };

  const handleMoveBlockUp = (blockId: string) => {
    const currentIndex = pageBlocks.findIndex(block => block.id === blockId);
    if (currentIndex > 0) {
      const newBlocks = [...pageBlocks];
      [newBlocks[currentIndex - 1], newBlocks[currentIndex]] = [newBlocks[currentIndex], newBlocks[currentIndex - 1]];
      setPageBlocks(newBlocks);
    }
  };

  const handleMoveBlockDown = (blockId: string) => {
    const currentIndex = pageBlocks.findIndex(block => block.id === blockId);
    if (currentIndex < pageBlocks.length - 1) {
      const newBlocks = [...pageBlocks];
      [newBlocks[currentIndex], newBlocks[currentIndex + 1]] = [newBlocks[currentIndex + 1], newBlocks[currentIndex]];
      setPageBlocks(newBlocks);
    }
  };

  const handleToggleCollapse = (blockId: string) => {
    setPageBlocks(pageBlocks.map(block => 
      block.id === blockId ? { ...block, isCollapsed: !block.isCollapsed } : block
    ));
  };

  const handleTestPage = () => {
    setShowTestPreview(true);
  };

  const handlePublish = () => {
    setShowPublishModal(true);
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const handleSelectAllCountries = () => {
    const allCountries = Object.keys(selectedCities);
    setSelectedCountries(allCountries);
  };

  const handleDeselectAllCountries = () => {
    setSelectedCountries([]);
  };

  const getTotalCities = () => {
    return selectedCountries.reduce((total, country) => {
      return total + (selectedCities[country]?.length || 0);
    }, 0);
  };

  const getFilteredCountries = () => {
    const allCountries = Object.keys(selectedCities);
    if (!searchQuery) return allCountries;
    
    return allCountries.filter(country => 
      country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      selectedCities[country].some(city => 
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const handlePublishTemplate = () => {
    // Here you would implement the actual publish logic
    console.log('Publishing template to:', selectedCountries, 'Total cities:', getTotalCities());
    
    // Generate pages for each selected country/city combination
    const newPages: any[] = [];
    selectedCountries.forEach(country => {
      selectedCities[country]?.forEach(city => {
        const pageId = `PG${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        newPages.push({
          id: pageId,
          title: `${templateTitle} - ${city}, ${country}`,
          url: `https://invensislearning.com/${country.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}/${templateTitle.toLowerCase().replace(/\s+/g, '-')}`,
          template: templateTitle,
          status: 'published',
          publishedDate: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0],
          views: 0,
          countries: [country],
          cities: [city],
          author: 'System Generated',
          category: 'Generated Page',
          generatedFrom: templateTitle
        });
      });
    });

    // Store generated pages in localStorage
    const existingPages = JSON.parse(localStorage.getItem('generatedPages') || '[]');
    const updatedPages = [...existingPages, ...newPages];
    localStorage.setItem('generatedPages', JSON.stringify(updatedPages));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('pagesGenerated', { detail: newPages }));
    
    setShowPublishModal(false);
    alert(`Successfully published template to ${selectedCountries.length} countries and ${getTotalCities()} cities!`);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showAddBlockDropdown) {
        const target = event.target as Element;
        if (!target.closest('.relative')) {
          setShowAddBlockDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddBlockDropdown]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{templateTitle}</h1>
              <p className="text-sm text-gray-500">Category Page Template</p>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="text-gray-600">Draft v2.3</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Draft</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Submit for Review</span>
              </button>
              <button 
                onClick={handleTestPage}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Test Page</span>
              </button>
              <button 
                onClick={handlePublish}
                className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Publish</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Dynamic Variables Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Dynamic Variables</h3>
              <button 
                onClick={() => setShowVariablesModal(true)}
                className="text-red-600 text-sm hover:text-red-700 cursor-pointer"
              >
                View All
              </button>
            </div>
          </div>

          {/* Content Blocks Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Content Blocks</h3>
                <div className="relative">
                  <button
                    onClick={() => setShowAddBlockDropdown(!showAddBlockDropdown)}
                    className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                    title="Add Content Block"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  
                  {/* Add Block Dropdown */}
                  {showAddBlockDropdown && (
                    <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            handleAddBlock('hero');
                            setShowAddBlockDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <span className="text-lg">🎯</span>
                          <div>
                            <div className="font-medium text-gray-900">Hero Section</div>
                            <div className="text-xs text-gray-500">Banner with CTA</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            handleAddBlock('course-grid');
                            setShowAddBlockDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <span className="text-lg">📚</span>
                          <div>
                            <div className="font-medium text-gray-900">Course Grid</div>
                            <div className="text-xs text-gray-500">Display courses</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            handleAddBlock('pricing');
                            setShowAddBlockDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <span className="text-lg">💰</span>
                          <div>
                            <div className="font-medium text-gray-900">Pricing Table</div>
                            <div className="text-xs text-gray-500">Course pricing</div>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            handleAddBlock('testimonials');
                            setShowAddBlockDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <span className="text-lg">💬</span>
                          <div>
                            <div className="font-medium text-gray-900">Testimonials</div>
                            <div className="text-xs text-gray-500">Customer reviews</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {contentBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      block.isActive 
                        ? 'bg-orange-100 border border-orange-200' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleAddBlock(block.type)}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      block.type === 'hero' ? 'bg-red-100' :
                      block.type === 'course-grid' ? 'bg-yellow-100' :
                      block.type === 'pricing' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <span className="text-sm">{block.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{block.title}</p>
                      <p className="text-xs text-gray-500 truncate">{block.description}</p>
                    </div>
                    <div className="w-4 h-4 border border-gray-300 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-medium ${
                      activeTab === tab 
                        ? 'text-gray-900 border-b-2 border-gray-900 pb-1' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  <span>Add Block</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-4">
              {pageBlocks.map((block, index) => (
                <div key={block.id} className="relative group">
                  {/* Block Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleCollapse(block.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {block.isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                      <span className="text-sm font-medium text-blue-600">{block.title}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleMoveBlockUp(block.id)}
                        disabled={index === 0}
                        className={`p-1 ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleMoveBlockDown(block.id)}
                        disabled={index === pageBlocks.length - 1}
                        className={`p-1 ${index === pageBlocks.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Block Content */}
                  {!block.isCollapsed && (
                    <div className="bg-white rounded-lg border-2 border-blue-200 overflow-hidden">
                      {block.type === 'hero' && (
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12">
                          <h1 className="text-4xl font-bold mb-4">{block.content.title}</h1>
                          <p className="text-xl mb-6">{block.content.subtitle}</p>
                          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold">
                            {block.content.buttonText}
                          </button>
                        </div>
                      )}
                      
                      {block.type === 'course-grid' && (
                        <div className="p-8 bg-gray-50">
                          <div className="grid grid-cols-2 gap-6">
                            {block.content.courses.map((course: any, courseIndex: number) => (
                              <div key={courseIndex} className="bg-white p-6 rounded-lg border">
                                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                                <p className="text-gray-600 mb-4">{course.duration} • {course.price}</p>
                                <button className="text-blue-600 hover:text-blue-700 font-medium">
                                  {course.description}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add Block Button */}
                  {index < pageBlocks.length - 1 && (
                    <div className="flex justify-center my-4">
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-600">
                        <Plus className="w-4 h-4" />
                        <span>Add Block</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Final Add Block Button */}
              <div className="flex justify-center py-8">
                <button className="flex items-center space-x-2 px-6 py-3 text-gray-500 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-600">
                  <Plus className="w-4 h-4" />
                  <span>Add Block</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span>📏 513, 322px</span>
            <div className="flex items-center space-x-2">
              <input type="checkbox" className="w-4 h-4" />
              <span>4792 × 4080px</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>100%</span>
            <button className="text-blue-600">🔍</button>
          </div>
        </div>
      </div>

      {/* Test Page Preview Modal */}
      {showTestPreview && (
        <TestPagePreview onClose={() => setShowTestPreview(false)} />
      )}

      {/* Dynamic Variables Modal */}
      {showVariablesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Dynamic Variables</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Available variables for use in your templates
                </p>
              </div>
              <button
                onClick={() => setShowVariablesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allDynamicVariables.map((variable, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded font-mono">
                        {variable.key}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(variable.key);
                        }}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{variable.description}</p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Example:</span> {variable.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {allDynamicVariables.length} variables available
                </p>
                <button
                  onClick={() => setShowVariablesModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Template Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Publish Template</h2>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Countries & Cities</h3>
                <p className="text-gray-600 mb-4">
                  Choose the locations where this template will be published. All countries are selected by default.
                </p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={handleSelectAllCountries}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleDeselectAllCountries}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Deselect All
                  </button>
                  <span className="text-sm text-gray-600">
                    {selectedCountries.length} of {Object.keys(selectedCities).length} countries selected ({getTotalCities()} cities)
                  </span>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search countries or cities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
                {getFilteredCountries().map((country) => (
                  <div key={country} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedCountries.includes(country)}
                          onChange={() => handleCountryToggle(country)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="font-semibold text-gray-900">{country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {country === 'United States' ? 'US' :
                           country === 'United Kingdom' ? 'UK' :
                           country === 'Canada' ? 'CA' :
                           country === 'Australia' ? 'AU' :
                           country === 'Germany' ? 'DE' :
                           country === 'France' ? 'FR' :
                           country === 'India' ? 'IN' :
                           country === 'Singapore' ? 'SG' :
                           country === 'Japan' ? 'JP' :
                           country === 'Netherlands' ? 'NL' : ''}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">
                        {selectedCities[country]?.length || 0} of {selectedCities[country]?.length || 0} cities selected
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Cities:</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedCities[country]?.map((city) => (
                        <span
                          key={city}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Template will be published to <span className="font-semibold">{selectedCountries.length}</span> countries and <span className="font-semibold">{getTotalCities()}</span> cities
                </p>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowPublishModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublishTemplate}
                    disabled={selectedCountries.length === 0}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Publish Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualPageBuilder;