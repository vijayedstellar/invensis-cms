import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  ExternalLink,
  Calendar,
  Globe,
  Users,
  MoreVertical,
  Plus,
  X,
  Upload
} from 'lucide-react';

interface Page {
  id: string;
  title: string;
  url: string;
  template: string;
  status: 'published' | 'draft' | 'archived';
  publishedDate: string;
  lastModified: string;
  views: number;
  countries: string[];
  cities: string[];
  author: string;
  category: string;
}

interface Column {
  key: keyof Page | 'actions' | 'select';
  label: string;
  visible: boolean;
  sortable: boolean;
}

const PagesManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Page>('publishedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [generatedPages, setGeneratedPages] = useState<Page[]>([]);
  const [showBulkChangesModal, setShowBulkChangesModal] = useState(false);

  const [columns, setColumns] = useState<Column[]>([
    { key: 'select', label: 'Select', visible: true, sortable: false },
    { key: 'id', label: 'ID', visible: true, sortable: true },
    { key: 'title', label: 'Title', visible: true, sortable: true },
    { key: 'url', label: 'URL', visible: true, sortable: false },
    { key: 'template', label: 'Template', visible: true, sortable: true },
    { key: 'status', label: 'Status', visible: true, sortable: true },
    { key: 'publishedDate', label: 'Published Date', visible: true, sortable: true },
    { key: 'lastModified', label: 'Last Modified', visible: false, sortable: true },
    { key: 'views', label: 'Views', visible: true, sortable: true },
    { key: 'countries', label: 'Countries', visible: false, sortable: false },
    { key: 'cities', label: 'Cities', visible: false, sortable: false },
    { key: 'author', label: 'Author', visible: false, sortable: true },
    { key: 'category', label: 'Category', visible: true, sortable: true },
    { key: 'actions', label: 'Actions', visible: true, sortable: false }
  ]);

  // Sample data - in a real app, this would come from an API
  const [pages, setPages] = useState<Page[]>([
    {
      id: 'PG001',
      title: 'DevOps Foundation Training - United States',
      url: 'https://invensislearning.com/us/devops-foundation',
      template: 'Corporate Training Hub',
      status: 'published',
      publishedDate: '2024-01-15',
      lastModified: '2024-01-20',
      views: 15420,
      countries: ['United States'],
      cities: ['New York', 'Los Angeles', 'Chicago'],
      author: 'Sarah Johnson',
      category: 'DevOps Training'
    },
    {
      id: 'PG002',
      title: 'PMP Certification Course - United Kingdom',
      url: 'https://invensislearning.com/uk/pmp-certification',
      template: 'Individual Learner Portal',
      status: 'published',
      publishedDate: '2024-01-12',
      lastModified: '2024-01-18',
      views: 8930,
      countries: ['United Kingdom'],
      cities: ['London', 'Manchester', 'Birmingham'],
      author: 'Mike Johnson',
      category: 'Project Management'
    },
    {
      id: 'PG003',
      title: 'AWS Solutions Architect - Canada',
      url: 'https://invensislearning.com/ca/aws-solutions-architect',
      template: 'Course Page',
      status: 'published',
      publishedDate: '2024-01-10',
      lastModified: '2024-01-16',
      views: 12350,
      countries: ['Canada'],
      cities: ['Toronto', 'Vancouver', 'Montreal'],
      author: 'Anna Lee',
      category: 'Cloud Computing'
    },
    {
      id: 'PG004',
      title: 'Six Sigma Green Belt - Australia',
      url: 'https://invensislearning.com/au/six-sigma-green-belt',
      template: 'Quality Management',
      status: 'draft',
      publishedDate: '2024-01-08',
      lastModified: '2024-01-22',
      views: 0,
      countries: ['Australia'],
      cities: ['Sydney', 'Melbourne', 'Brisbane'],
      author: 'David Chen',
      category: 'Quality Management'
    },
    {
      id: 'PG005',
      title: 'Scrum Master Certification - Germany',
      url: 'https://invensislearning.com/de/scrum-master',
      template: 'Regional Training Center',
      status: 'published',
      publishedDate: '2024-01-05',
      lastModified: '2024-01-14',
      views: 6780,
      countries: ['Germany'],
      cities: ['Berlin', 'Munich', 'Hamburg'],
      author: 'Emma Wilson',
      category: 'Agile & Scrum'
    },
    {
      id: 'PG006',
      title: 'ITIL Foundation - France',
      url: 'https://invensislearning.com/fr/itil-foundation',
      template: 'IT Service Management',
      status: 'published',
      publishedDate: '2024-01-03',
      lastModified: '2024-01-12',
      views: 4560,
      countries: ['France'],
      cities: ['Paris', 'Lyon', 'Marseille'],
      author: 'Sophie Martin',
      category: 'IT Service Management'
    },
    {
      id: 'PG007',
      title: 'Lean Six Sigma Black Belt - India',
      url: 'https://invensislearning.com/in/lean-six-sigma-black-belt',
      template: 'Course Page',
      status: 'archived',
      publishedDate: '2023-12-28',
      lastModified: '2024-01-10',
      views: 18920,
      countries: ['India'],
      cities: ['Mumbai', 'Delhi', 'Bangalore'],
      author: 'Raj Patel',
      category: 'Quality Management'
    },
    {
      id: 'PG008',
      title: 'Digital Marketing Certification - Japan',
      url: 'https://invensislearning.com/jp/digital-marketing',
      template: 'Individual Learner Portal',
      status: 'published',
      publishedDate: '2023-12-25',
      lastModified: '2024-01-08',
      views: 3240,
      countries: ['Japan'],
      cities: ['Tokyo', 'Osaka', 'Yokohama'],
      author: 'Yuki Tanaka',
      category: 'Digital Marketing'
    },
    {
      id: 'PG009',
      title: 'Cybersecurity Fundamentals - Singapore',
      url: 'https://invensislearning.com/sg/cybersecurity-fundamentals',
      template: 'Corporate Training Hub',
      status: 'published',
      publishedDate: '2023-12-20',
      lastModified: '2024-01-05',
      views: 7890,
      countries: ['Singapore'],
      cities: ['Singapore'],
      author: 'Li Wei',
      category: 'Cybersecurity'
    },
    {
      id: 'PG010',
      title: 'Data Science with Python - Netherlands',
      url: 'https://invensislearning.com/nl/data-science-python',
      template: 'Course Page',
      status: 'draft',
      publishedDate: '2023-12-18',
      lastModified: '2024-01-03',
      views: 0,
      countries: ['Netherlands'],
      cities: ['Amsterdam', 'Rotterdam', 'The Hague'],
      author: 'Hans van Berg',
      category: 'Data Science'
    }
  ]);

  // Load generated pages from localStorage on component mount
  React.useEffect(() => {
    const loadGeneratedPages = () => {
      const stored = localStorage.getItem('generatedPages');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setGeneratedPages(parsed);
        } catch (error) {
          console.error('Error loading generated pages:', error);
        }
      }
    };

    loadGeneratedPages();

    // Listen for new pages being generated
    const handlePagesGenerated = (event: CustomEvent) => {
      loadGeneratedPages(); // Reload from localStorage
    };

    window.addEventListener('pagesGenerated', handlePagesGenerated as EventListener);
    
    return () => {
      window.removeEventListener('pagesGenerated', handlePagesGenerated as EventListener);
    };
  }, []);

  const samplePages: Page[] = [
    {
      id: 'PG011',
      title: 'Machine Learning Fundamentals - Brazil',
      url: 'https://invensislearning.com/br/machine-learning-fundamentals',
      template: 'Course Page',
      status: 'published',
      publishedDate: '2024-01-25',
      lastModified: '2024-01-26',
      views: 5420,
      countries: ['Brazil'],
      cities: ['São Paulo', 'Rio de Janeiro', 'Brasília'],
      author: 'Carlos Silva',
      category: 'Machine Learning'
    },
    {
      id: 'PG012',
      title: 'Cloud Security Essentials - Mexico',
      url: 'https://invensislearning.com/mx/cloud-security-essentials',
      template: 'Corporate Training Hub',
      status: 'draft',
      publishedDate: '2024-01-23',
      lastModified: '2024-01-24',
      views: 0,
      countries: ['Mexico'],
      cities: ['Mexico City', 'Guadalajara', 'Monterrey'],
      author: 'Maria Rodriguez',
      category: 'Cybersecurity'
    },
    {
      id: 'PG013',
      title: 'Blockchain Development - South Korea',
      url: 'https://invensislearning.com/kr/blockchain-development',
      template: 'Individual Learner Portal',
      status: 'published',
      publishedDate: '2024-01-22',
      lastModified: '2024-01-23',
      views: 3890,
      countries: ['South Korea'],
      cities: ['Seoul', 'Busan', 'Incheon'],
      author: 'Kim Min-jun',
      category: 'Blockchain'
    },
    {
      id: 'PG014',
      title: 'UI/UX Design Masterclass - Italy',
      url: 'https://invensislearning.com/it/ui-ux-design-masterclass',
      template: 'Course Page',
      status: 'published',
      publishedDate: '2024-01-20',
      lastModified: '2024-01-21',
      views: 7650,
      countries: ['Italy'],
      cities: ['Rome', 'Milan', 'Naples'],
      author: 'Giuseppe Rossi',
      category: 'Design'
    },
    {
      id: 'PG015',
      title: 'DevSecOps Implementation - Spain',
      url: 'https://invensislearning.com/es/devsecops-implementation',
      template: 'Regional Training Center',
      status: 'archived',
      publishedDate: '2024-01-18',
      lastModified: '2024-01-19',
      views: 12340,
      countries: ['Spain'],
      cities: ['Madrid', 'Barcelona', 'Valencia'],
      author: 'Ana García',
      category: 'DevOps'
    },
    {
      id: 'PG016',
      title: 'Artificial Intelligence Ethics - Sweden',
      url: 'https://invensislearning.com/se/ai-ethics',
      template: 'Corporate Training Hub',
      status: 'published',
      publishedDate: '2024-01-16',
      lastModified: '2024-01-17',
      views: 4320,
      countries: ['Sweden'],
      cities: ['Stockholm', 'Gothenburg', 'Malmö'],
      author: 'Erik Andersson',
      category: 'Artificial Intelligence'
    },
    {
      id: 'PG017',
      title: 'Quantum Computing Basics - Switzerland',
      url: 'https://invensislearning.com/ch/quantum-computing-basics',
      template: 'Course Page',
      status: 'draft',
      publishedDate: '2024-01-14',
      lastModified: '2024-01-15',
      views: 0,
      countries: ['Switzerland'],
      cities: ['Zurich', 'Geneva', 'Basel'],
      author: 'Hans Mueller',
      category: 'Quantum Computing'
    },
    {
      id: 'PG018',
      title: 'Digital Transformation Strategy - Norway',
      url: 'https://invensislearning.com/no/digital-transformation-strategy',
      template: 'Individual Learner Portal',
      status: 'published',
      publishedDate: '2024-01-12',
      lastModified: '2024-01-13',
      views: 6780,
      countries: ['Norway'],
      cities: ['Oslo', 'Bergen', 'Trondheim'],
      author: 'Ingrid Hansen',
      category: 'Digital Transformation'
    },
    {
      id: 'PG019',
      title: 'Microservices Architecture - Belgium',
      url: 'https://invensislearning.com/be/microservices-architecture',
      template: 'Regional Training Center',
      status: 'published',
      publishedDate: '2024-01-10',
      lastModified: '2024-01-11',
      views: 5670,
      countries: ['Belgium'],
      cities: ['Brussels', 'Antwerp', 'Ghent'],
      author: 'Pierre Dubois',
      category: 'Software Architecture'
    },
    {
      id: 'PG020',
      title: 'Green IT Practices - Denmark',
      url: 'https://invensislearning.com/dk/green-it-practices',
      template: 'Course Page',
      status: 'archived',
      publishedDate: '2024-01-08',
      lastModified: '2024-01-09',
      views: 8900,
      countries: ['Denmark'],
      cities: ['Copenhagen', 'Aarhus', 'Odense'],
      author: 'Lars Nielsen',
      category: 'Sustainability'
    }
  ];

  const populateSamplePages = () => {
    const newPages = samplePages.filter(samplePage => 
      !allPages.some(existingPage => existingPage.id === samplePage.id)
    );
    setPages([...pages, ...newPages]);
  };

  // Combine static pages with generated pages
  const allPages = [...pages, ...generatedPages];

  const handleDeletePage = (pageId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this page? This action cannot be undone.')) {
      // Check if it's a generated page or static page
      const isGeneratedPage = generatedPages.some(page => page.id === pageId);
      
      if (isGeneratedPage) {
        // Remove from generated pages and update localStorage
        const updatedGenerated = generatedPages.filter(page => page.id !== pageId);
        setGeneratedPages(updatedGenerated);
        localStorage.setItem('generatedPages', JSON.stringify(updatedGenerated));
      } else {
        // Remove from static pages
        setPages(pages.filter(page => page.id !== pageId));
      }
      
      // Also remove from selected pages if it was selected
      setSelectedPages(prev => prev.filter(id => id !== pageId));
    }
  };

  const generateSampleCSV = () => {
    const headers = [
      'page_id',
      'city',
      'country',
      'template_id',
      'variables'
    ];
    
    const sampleData = [
      [
        'PG001',
        'New York',
        'United States',
        'training_city_v1',
        'city_name:New York|landmark:Times Square|business_area:Manhattan|transport:Penn Station|currency:$|local_companies:Goldman Sachs, JPMorgan|course_count:25+|base_price:2499|professionals_trained:50000+|training_venues:5 premium locations'
      ],
      [
        'PG002',
        'London',
        'United Kingdom',
        'training_city_v1',
        'city_name:London|landmark:Big Ben|business_area:City of London|transport:King\'s Cross|currency:£|local_companies:HSBC, Barclays|course_count:30+|base_price:1999|professionals_trained:75000+|training_venues:8 premium locations'
      ],
      [
        'PG003',
        'Toronto',
        'Canada',
        'training_city_v1',
        'city_name:Toronto|landmark:CN Tower|business_area:Financial District|transport:Union Station|currency:CAD|local_companies:RBC, TD Bank|course_count:20+|base_price:2299|professionals_trained:35000+|training_venues:4 premium locations'
      ],
      [
        'PG004',
        'Sydney',
        'Australia',
        'training_city_v1',
        'city_name:Sydney|landmark:Opera House|business_area:CBD|transport:Central Station|currency:AUD|local_companies:Commonwealth Bank, Westpac|course_count:18+|base_price:2799|professionals_trained:28000+|training_venues:3 premium locations'
      ]
    ];
    
    const csvContent = [headers, ...sampleData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'bulk_content_template_sample.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      
      try {
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        // Validate headers
        const expectedHeaders = ['page_id', 'city', 'country', 'template_id', 'variables'];
        const hasValidHeaders = expectedHeaders.every(header => headers.includes(header));
        
        if (!hasValidHeaders) {
          alert('Invalid CSV format. Please use the sample CSV template.');
          return;
        }
        
        const newPages: any[] = [];
        let processedCount = 0;
        let errorCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          try {
            const values = line.split(',').map(v => v.replace(/"/g, '').trim());
            const rowData: any = {};
            
            headers.forEach((header, index) => {
              rowData[header] = values[index] || '';
            });
            
            if (rowData.page_id && rowData.city && rowData.country) {
              // Parse variables
              const variables: any = {};
              if (rowData.variables) {
                const varPairs = rowData.variables.split('|');
                varPairs.forEach((pair: string) => {
                  const [key, value] = pair.split(':');
                  if (key && value) {
                    variables[key.trim()] = value.trim();
                  }
                });
              }
              
              // Generate page content based on template and variables
              const generatedPage = generatePageFromTemplate(rowData, variables);
              newPages.push(generatedPage);
              processedCount++;
            }
          } catch (error) {
            console.error('Error processing row:', i, error);
            errorCount++;
          }
        }
        
        if (newPages.length > 0) {
          // Store generated pages
          const existingPages = JSON.parse(localStorage.getItem('generatedPages') || '[]');
          const updatedPages = [...existingPages, ...newPages];
          localStorage.setItem('generatedPages', JSON.stringify(updatedPages));
          
          // Dispatch event to notify other components
          window.dispatchEvent(new CustomEvent('pagesGenerated', { detail: newPages }));
          
          alert(`Successfully processed ${processedCount} pages with multi-section content!\n${errorCount > 0 ? `${errorCount} rows had errors and were skipped.` : ''}`);
        } else {
          alert('No valid pages found in the CSV file.');
        }
        
      } catch (error) {
        console.error('CSV parsing error:', error);
        alert('Error parsing CSV file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  // Template-based page generation function
  const generatePageFromTemplate = (rowData: any, variables: any) => {
    const templateId = rowData.template_id || 'training_city_v1';
    
    // Default template structure with variable placeholders
    const templates: any = {
      'training_city_v1': {
        hero: {
          title: `{{category_name}} Training in ${variables.city_name || rowData.city}`,
          subtitle: `Master {{category_name}} with hands-on training in ${variables.business_area || 'the business district'}`,
          description: `Join ${variables.professionals_trained || '10,000+'} professionals who have advanced their careers with our comprehensive training programs.`,
          cta_primary: 'Start Learning Today',
          cta_secondary: 'View Schedule',
          background_image: `/images/cities/${rowData.city.toLowerCase().replace(/\s+/g, '-')}-hero.jpg`,
          local_context: `Located near ${variables.landmark || 'city center'} | Easy access from ${variables.transport || 'main station'}`
        },
        course_grid: {
          title: `${variables.course_count || '20+'} Courses Available`,
          subtitle: 'Choose from our comprehensive training catalog',
          featured_courses: [
            {
              name: 'Foundation Course',
              duration: '3 days',
              price: `${variables.currency || '$'}${Math.floor(parseInt(variables.base_price || '1999') * 0.6)}`,
              level: 'Beginner'
            },
            {
              name: 'Professional Course',
              duration: '5 days',
              price: `${variables.currency || '$'}${variables.base_price || '1999'}`,
              level: 'Intermediate'
            },
            {
              name: 'Expert Certification',
              duration: '7 days',
              price: `${variables.currency || '$'}${Math.floor(parseInt(variables.base_price || '1999') * 1.4)}`,
              level: 'Advanced'
            }
          ]
        },
        pricing: {
          title: 'Training Investment',
          subtitle: `Competitive pricing in ${variables.currency || '$'}`,
          packages: [
            {
              name: 'Individual',
              price: `${variables.currency || '$'}${variables.base_price || '1999'}`,
              features: ['Course Materials', 'Certification', '6 Months Support']
            },
            {
              name: 'Corporate',
              price: 'Custom Quote',
              features: ['Group Discounts', 'On-site Training', 'Dedicated Support']
            }
          ]
        },
        testimonials: {
          title: `What Our ${rowData.city} Students Say`,
          subtitle: `Success stories from ${variables.professionals_trained || '1,000+'} trained professionals`,
          reviews: [
            {
              text: `Excellent training experience in ${variables.business_area || rowData.city}. The location was perfect and easily accessible from ${variables.transport || 'public transport'}.`,
              author: 'Professional',
              company: variables.local_companies?.split(',')[0]?.trim() || 'Local Company',
              rating: 5
            },
            {
              text: `Highly recommend this training! Great facilities and expert instructors. Perfect for professionals in the ${variables.business_area || rowData.city} area.`,
              author: 'Manager',
              company: variables.local_companies?.split(',')[1]?.trim() || 'Enterprise Client',
              rating: 5
            }
          ]
        },
        location_info: {
          venues: variables.training_venues || '3 premium locations',
          address: `Training Center, ${variables.business_area || 'Business District'}, ${rowData.city}`,
          transport: variables.transport || 'Public Transport Hub',
          landmark: variables.landmark || 'City Center',
          local_companies: variables.local_companies || 'Major Corporations'
        }
      }
    };
    
    const template = templates[templateId] || templates['training_city_v1'];
    
    // Generate the complete page object
    return {
      id: rowData.page_id,
      title: `{{category_name}} Training - ${rowData.city}, ${rowData.country}`,
      url: `https://invensislearning.com/${rowData.country.toLowerCase().replace(/\s+/g, '-')}/${rowData.city.toLowerCase().replace(/\s+/g, '-')}/{{category_name_slug}}`,
      template: `${templateId} (Multi-Section)`,
      status: 'published',
      publishedDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      views: 0,
      countries: [rowData.country],
      cities: [rowData.city],
      author: 'Bulk Import System',
      category: 'Template Generated',
      generatedFrom: `Template: ${templateId}`,
      contentBlocks: template,
      variables: variables,
      templateId: templateId
    };
  };

  const filteredAndSortedPages = useMemo(() => {
    let filtered = allPages.filter(page => {
      const matchesSearch = 
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || page.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });

    return filtered;
  }, [allPages, searchQuery, statusFilter, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPages = filteredAndSortedPages.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof Page) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleColumnToggle = (columnKey: keyof Page | 'actions' | 'select') => {
    setColumns(columns.map(col => 
      col.key === columnKey ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleSelectAll = () => {
    if (selectedPages.length === paginatedPages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(paginatedPages.map(page => page.id));
    }
  };

  const handleSelectPage = (pageId: string) => {
    setSelectedPages(prev => 
      prev.includes(pageId) 
        ? prev.filter(id => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleBulkAction = (action: string) => {
    if (action === 'delete') {
      const confirmMessage = `Are you sure you want to permanently delete ${selectedPages.length} page${selectedPages.length !== 1 ? 's' : ''}? This action cannot be undone.`;
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    
    if (action === 'delete') {
      // Remove pages permanently
      const updatedStaticPages = pages.filter(page => !selectedPages.includes(page.id));
      const updatedGeneratedPages = generatedPages.filter(page => !selectedPages.includes(page.id));
      
      setPages(updatedStaticPages);
      setGeneratedPages(updatedGeneratedPages);
      localStorage.setItem('generatedPages', JSON.stringify(updatedGeneratedPages));
    } else {
      // Update static pages
      const updatedStaticPages = pages.map(page => {
        if (selectedPages.includes(page.id)) {
          switch (action) {
            case 'publish':
              return { ...page, status: 'published' as const };
            case 'draft':
              return { ...page, status: 'draft' as const };
            case 'archive':
              return { ...page, status: 'archived' as const };
            default:
              return page;
          }
        }
        return page;
      });
      
      // Update generated pages
      const updatedGeneratedPages = generatedPages.map(page => {
        if (selectedPages.includes(page.id)) {
          switch (action) {
            case 'publish':
              return { ...page, status: 'published' as const };
            case 'draft':
              return { ...page, status: 'draft' as const };
            case 'archive':
              return { ...page, status: 'archived' as const };
            default:
              return page;
          }
        }
        return page;
      });
      
      // Update both sets of pages
      setPages(updatedStaticPages);
      setGeneratedPages(updatedGeneratedPages);
      localStorage.setItem('generatedPages', JSON.stringify(updatedGeneratedPages));
    }
    
    // Clear selection after action
    setSelectedPages([]);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      published: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const visibleColumns = columns.filter(col => col.visible);

  const isAllSelected = selectedPages.length === paginatedPages.length && paginatedPages.length > 0;
  const isIndeterminate = selectedPages.length > 0 && selectedPages.length < paginatedPages.length;

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Pages</h1>
            <p className="text-gray-600">
              Manage all published pages across your global network 
              {generatedPages.length > 0 && (
                <span className="ml-2 text-blue-600 font-medium">
                  ({generatedPages.length} generated pages)
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 border-2 border-red-600">
              <span>Bulk Changes</span>
            </button>
            <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button 
              onClick={() => setShowBulkChangesModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 border-2 border-red-600"
            >
              <span>Bulk Changes</span>
            </button>
            <button 
              onClick={populateSamplePages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sample Pages</span>
            </button>
            {generatedPages.length > 0 && (
              <button 
                onClick={() => {
                  localStorage.removeItem('generatedPages');
                  setGeneratedPages([]);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <span>Clear Generated Pages</span>
              </button>
            )}
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedPages.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('publish')}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Publish
                  </button>
                  <button
                    onClick={() => handleBulkAction('draft')}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                  >
                    Move to Draft
                  </button>
                  <button
                    onClick={() => handleBulkAction('archive')}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1 bg-red-800 text-white text-sm rounded hover:bg-red-900"
                  >
                    Delete Permanently
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedPages([])}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Filters and Search - Compact Layout */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
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
                <span className="text-sm text-gray-500">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search pages, URLs, templates, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Column Settings Panel */}
        {showColumnSettings && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customize Columns</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {columns.map((column) => (
                <label 
                  key={column.key} 
                  className={`flex items-center space-x-2 cursor-pointer ${column.key === 'select' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => handleColumnToggle(column.key)}
                    disabled={column.key === 'select'}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{column.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: The "Select" column cannot be hidden as it's required for bulk operations.
            </p>
          </div>
        )}

        {/* Results Summary with Select All */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedPages.length)} of {filteredAndSortedPages.length} pages
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">Select all</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Total Views: {formatNumber(filteredAndSortedPages.reduce((sum, page) => sum + page.views, 0))}
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {visibleColumns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                      onClick={() => column.sortable && column.key !== 'actions' && handleSort(column.key as keyof Page)}
                    >
                      {column.key === 'select' ? null : (
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {column.sortable && column.key === sortField && (
                            <span className="text-blue-500">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPages.map((page) => (
                  <tr key={page.id} className={`hover:bg-gray-50 ${selectedPages.includes(page.id) ? 'bg-blue-50' : ''}`}>
                    {visibleColumns.map((column) => (
                      <td key={`${page.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                        {column.key === 'select' && (
                          <input
                            type="checkbox"
                            checked={selectedPages.includes(page.id)}
                            onChange={() => handleSelectPage(page.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        )}
                        {column.key === 'id' && (
                          <span className="text-sm font-medium text-gray-900">{page.id}</span>
                        )}
                        {column.key === 'title' && (
                          <div className="max-w-xs">
                            <p className="text-sm font-medium text-gray-900 truncate">{page.title}</p>
                          </div>
                        )}
                        {column.key === 'url' && (
                          <div className="max-w-xs">
                            <a 
                              href={page.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 truncate flex items-center space-x-1"
                            >
                              <span className="truncate">{page.url}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          </div>
                        )}
                        {column.key === 'template' && (
                          <span className="text-sm text-gray-900">{page.template}</span>
                        )}
                        {column.key === 'status' && getStatusBadge(page.status)}
                        {column.key === 'publishedDate' && (
                          <span className="text-sm text-gray-900">{formatDate(page.publishedDate)}</span>
                        )}
                        {column.key === 'lastModified' && (
                          <span className="text-sm text-gray-900">{formatDate(page.lastModified)}</span>
                        )}
                        {column.key === 'views' && (
                          <span className="text-sm text-gray-900">{formatNumber(page.views)}</span>
                        )}
                        {column.key === 'countries' && (
                          <div className="flex flex-wrap gap-1">
                            {page.countries.map((country, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {country}
                              </span>
                            ))}
                          </div>
                        )}
                        {column.key === 'cities' && (
                          <div className="max-w-xs">
                            <span className="text-sm text-gray-600">
                              {page.cities.length} cities
                            </span>
                          </div>
                        )}
                        {column.key === 'author' && (
                          <span className="text-sm text-gray-900">{page.author}</span>
                        )}
                        {column.key === 'category' && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-purple-600">{page.category}</span>
                            {(page as any).generatedFrom && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Generated
                              </span>
                            )}
                          </div>
                        )}
                        {column.key === 'actions' && (
                          <div className="flex items-center space-x-2">
                            <button 
                              className="p-1 text-gray-400 hover:text-blue-600"
                              title="View Page"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1 text-gray-400 hover:text-green-600"
                              title="Edit Page"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Delete Page Permanently"
                              onClick={() => handleDeletePage(page.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="More Options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Bulk Changes Modal */}
        {showBulkChangesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Bulk Changes</h2>
                <button
                  onClick={() => setShowBulkChangesModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Pages from CSV</h3>
                  <p className="text-gray-600 mb-4">
                    Upload a CSV file to bulk import or update pages. Download the sample CSV file to see the required format.
                  </p>
                  
                  {/* Sample CSV Download */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">Multi-Section Content Template</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Download a template for bulk updating hero, course, pricing, and testimonial sections
                        </p>
                      </div>
                      <button
                        onClick={generateSampleCSV}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Sample</span>
                      </button>
                    </div>
                  </div>

                  {/* CSV Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="mb-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h4>
                      <p className="text-gray-600">
                        Select a CSV file to import pages data
                      </p>
                    </div>
                    
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVImport}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose CSV File
                    </label>
                  </div>

                  {/* CSV Format Information */}
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">CSV Format Requirements</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• <strong>Required columns:</strong> page_id, city, country, template_id, variables</p>
                      <p>• <strong>Template IDs:</strong> training_city_v1 (supports hero, courses, pricing, testimonials)</p>
                      <p>• <strong>Variables format:</strong> key:value pairs separated by | (pipe)</p>
                      <p>• <strong>Example variables:</strong> city_name:New York|landmark:Times Square|currency:$|base_price:2499</p>
                      <p>• <strong>Supported sections:</strong> Hero, Course Grid, Pricing Table, Testimonials, Location Info</p>
                      <p>• <strong>Encoding:</strong> UTF-8</p>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <h5 className="font-medium text-blue-900 mb-2">Available Template Variables:</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                        <div>
                          <p><strong>Location:</strong> city_name, landmark, business_area, transport</p>
                          <p><strong>Business:</strong> local_companies, professionals_trained</p>
                        </div>
                        <div>
                          <p><strong>Pricing:</strong> currency, base_price, course_count</p>
                          <p><strong>Facilities:</strong> training_venues</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Import will generate multi-section content for pages based on templates and variables
                  </p>
                  <button
                    onClick={() => setShowBulkChangesModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PagesManagement;