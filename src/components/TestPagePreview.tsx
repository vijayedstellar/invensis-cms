import React, { useState } from 'react';
import { X, Eye, Code, Globe, RefreshCw } from 'lucide-react';

interface TestPagePreviewProps {
  onClose: () => void;
}

interface DynamicVariable {
  key: string;
  value: string;
  description: string;
}

const TestPagePreview: React.FC<TestPagePreviewProps> = ({ onClose }) => {
  const [previewMode, setPreviewMode] = useState<'preview' | 'code'>('preview');
  const [selectedLocation, setSelectedLocation] = useState('United States');
  
  // Sample dynamic variables that would be replaced
  const [dynamicVariables, setDynamicVariables] = useState<DynamicVariable[]>([
    { key: '{{category_name}}', value: 'DevOps', description: 'Training category name' },
    { key: '{{company_name}}', value: 'Invensis Learning', description: 'Company brand name' },
    { key: '{{country}}', value: 'United States', description: 'Target country' },
    { key: '{{city}}', value: 'New York', description: 'Primary city for training' },
    { key: '{{city_population}}', value: '8.3 million', description: 'City population for context' },
    { key: '{{city_business_district}}', value: 'Manhattan', description: 'Main business area in city' },
    { key: '{{nearby_cities}}', value: 'Brooklyn, Queens, Bronx', description: 'Nearby cities/areas served' },
    { key: '{{local_landmarks}}', value: 'Times Square, Central Park', description: 'Famous local landmarks' },
    { key: '{{training_venues}}', value: '5 premium locations', description: 'Number of training venues in city' },
    { key: '{{city_professionals}}', value: '50,000+', description: 'Number of professionals trained in city' },
    { key: '{{local_companies}}', value: 'Goldman Sachs, JPMorgan, IBM', description: 'Major local companies' },
    { key: '{{transport_hubs}}', value: 'Penn Station, Grand Central', description: 'Major transport connections' },
    { key: '{{city_code}}', value: 'NYC', description: 'City abbreviation/code' },
    { key: '{{metro_area}}', value: 'Greater New York Area', description: 'Metropolitan area name' },
    { key: '{{region}}', value: 'North America', description: 'Geographic region' },
    { key: '{{course_count}}', value: '25+', description: 'Number of courses in category' },
    { key: '{{certification_body}}', value: 'DevOps Institute', description: 'Certifying organization' },
    { key: '{{local_phone}}', value: '+1-800-555-0123', description: 'Local contact number' },
    { key: '{{local_email}}', value: 'info.us@invensislearning.com', description: 'Local contact email' },
    { key: '{{currency}}', value: '$', description: 'Local currency symbol' },
    { key: '{{price}}', value: '2,499', description: 'Course price in local currency' },
    { key: '{{timezone}}', value: 'EST', description: 'Local timezone' },
    { key: '{{language}}', value: 'English', description: 'Primary language' },
    { key: '{{office_address}}', value: '123 Business Ave, New York, NY 10001', description: 'Local office address' }
  ]);

  const locations = [
    // Countries
    { type: 'country', name: 'United States', displayName: 'United States' },
    { type: 'country', name: 'United Kingdom', displayName: 'United Kingdom' },
    { type: 'country', name: 'Canada', displayName: 'Canada' },
    { type: 'country', name: 'Australia', displayName: 'Australia' },
    { type: 'country', name: 'Germany', displayName: 'Germany' },
    { type: 'country', name: 'France', displayName: 'France' },
    { type: 'country', name: 'India', displayName: 'India' },
    { type: 'country', name: 'Singapore', displayName: 'Singapore' },
    { type: 'country', name: 'Japan', displayName: 'Japan' },
    { type: 'country', name: 'Netherlands', displayName: 'Netherlands' },
    
    // Cities
    { type: 'city', name: 'New York', displayName: 'New York, USA' },
    { type: 'city', name: 'London', displayName: 'London, UK' },
    { type: 'city', name: 'Toronto', displayName: 'Toronto, Canada' },
    { type: 'city', name: 'Sydney', displayName: 'Sydney, Australia' },
    { type: 'city', name: 'Berlin', displayName: 'Berlin, Germany' },
    { type: 'city', name: 'Paris', displayName: 'Paris, France' },
    { type: 'city', name: 'Mumbai', displayName: 'Mumbai, India' },
    { type: 'city', name: 'Singapore City', displayName: 'Singapore City' },
    { type: 'city', name: 'Tokyo', displayName: 'Tokyo, Japan' },
    { type: 'city', name: 'Amsterdam', displayName: 'Amsterdam, Netherlands' }
  ];

  const handleLocationChange = (locationName: string) => {
    setSelectedLocation(locationName);
    
    // Find the location to determine if it's a country or city
    const location = locations.find(loc => loc.name === locationName);
    if (!location) return;
    
    // Country-specific data mappings
    const locationData: Record<string, {
      country: string;
      city: string;
      cityPopulation: string;
      businessDistrict: string;
      nearbyCities: string;
      landmarks: string;
      trainingVenues: string;
      cityProfessionals: string;
      localCompanies: string;
      transportHubs: string;
      cityCode: string;
      metroArea: string;
      region: string;
      currency: string;
      phone: string;
      email: string;
      timezone: string;
      language: string;
      address: string;
    }> = {
      'United States': {
        country: 'United States',
        city: 'New York',
        cityPopulation: '8.3 million',
        businessDistrict: 'Manhattan',
        nearbyCities: 'Brooklyn, Queens, Bronx',
        landmarks: 'Times Square, Central Park',
        trainingVenues: '5 premium locations',
        cityProfessionals: '50,000+',
        localCompanies: 'Goldman Sachs, JPMorgan, IBM',
        transportHubs: 'Penn Station, Grand Central',
        cityCode: 'NYC',
        metroArea: 'Greater New York Area',
        region: 'North America',
        currency: '$',
        phone: '+1-800-555-0123',
        email: 'info.us@invensislearning.com',
        timezone: 'EST',
        language: 'English',
        address: '123 Business Ave, New York, NY 10001'
      },
      'United Kingdom': {
        country: 'United Kingdom',
        city: 'London',
        cityPopulation: '9.5 million',
        businessDistrict: 'City of London',
        nearbyCities: 'Westminster, Camden, Greenwich',
        landmarks: 'Big Ben, Tower Bridge',
        trainingVenues: '8 premium locations',
        cityProfessionals: '75,000+',
        localCompanies: 'HSBC, Barclays, BP',
        transportHubs: 'King\'s Cross, Paddington',
        cityCode: 'LON',
        metroArea: 'Greater London',
        region: 'Europe',
        currency: '£',
        phone: '+44-20-7946-0958',
        email: 'info.uk@invensislearning.com',
        timezone: 'GMT',
        language: 'English',
        address: '456 Training Street, London, EC1A 1BB'
      },
      'New York': {
        country: 'United States',
        city: 'New York',
        cityPopulation: '8.3 million',
        businessDistrict: 'Manhattan',
        nearbyCities: 'Brooklyn, Queens, Bronx',
        landmarks: 'Times Square, Central Park',
        trainingVenues: '5 premium locations',
        cityProfessionals: '50,000+',
        localCompanies: 'Goldman Sachs, JPMorgan, IBM',
        transportHubs: 'Penn Station, Grand Central',
        cityCode: 'NYC',
        metroArea: 'Greater New York Area',
        region: 'North America',
        currency: '$',
        phone: '+1-800-555-0123',
        email: 'info.us@invensislearning.com',
        timezone: 'EST',
        language: 'English',
        address: '123 Business Ave, New York, NY 10001'
      },
      'London': {
        country: 'United Kingdom',
        city: 'London',
        cityPopulation: '9.5 million',
        businessDistrict: 'City of London',
        nearbyCities: 'Westminster, Camden, Greenwich',
        landmarks: 'Big Ben, Tower Bridge',
        trainingVenues: '8 premium locations',
        cityProfessionals: '75,000+',
        localCompanies: 'HSBC, Barclays, BP',
        transportHubs: 'King\'s Cross, Paddington',
        cityCode: 'LON',
        metroArea: 'Greater London',
        region: 'Europe',
        currency: '£',
        phone: '+44-20-7946-0958',
        email: 'info.uk@invensislearning.com',
        timezone: 'GMT',
        language: 'English',
        address: '456 Training Street, London, EC1A 1BB'
      }
    };

    const data = locationData[locationName];
    if (!data) return;

    setDynamicVariables(prev => prev.map(variable => {
      if (variable.key === '{{country}}') {
        return { ...variable, value: data.country };
      }
      if (variable.key === '{{city}}') {
        return { ...variable, value: data.city };
      }
      if (variable.key === '{{city_population}}') {
        return { ...variable, value: data.cityPopulation };
      }
      if (variable.key === '{{city_business_district}}') {
        return { ...variable, value: data.businessDistrict };
      }
      if (variable.key === '{{nearby_cities}}') {
        return { ...variable, value: data.nearbyCities };
      }
      if (variable.key === '{{local_landmarks}}') {
        return { ...variable, value: data.landmarks };
      }
      if (variable.key === '{{training_venues}}') {
        return { ...variable, value: data.trainingVenues };
      }
      if (variable.key === '{{city_professionals}}') {
        return { ...variable, value: data.cityProfessionals };
      }
      if (variable.key === '{{local_companies}}') {
        return { ...variable, value: data.localCompanies };
      }
      if (variable.key === '{{transport_hubs}}') {
        return { ...variable, value: data.transportHubs };
      }
      if (variable.key === '{{city_code}}') {
        return { ...variable, value: data.cityCode };
      }
      if (variable.key === '{{metro_area}}') {
        return { ...variable, value: data.metroArea };
      }
      if (variable.key === '{{region}}') {
        return { ...variable, value: data.region };
      }
      if (variable.key === '{{currency}}') {
        return { ...variable, value: data.currency };
      }
      if (variable.key === '{{local_phone}}') {
        return { ...variable, value: data.phone };
      }
      if (variable.key === '{{local_email}}') {
        return { ...variable, value: data.email };
      }
      if (variable.key === '{{timezone}}') {
        return { ...variable, value: data.timezone };
      }
      if (variable.key === '{{language}}') {
        return { ...variable, value: data.language };
      }
      if (variable.key === '{{office_address}}') {
        return { ...variable, value: data.address };
      }
      return variable;
    }));
  };

  const handleVariableChange = (key: string, newValue: string) => {
    setDynamicVariables(prev => prev.map(variable => 
      variable.key === key ? { ...variable, value: newValue } : variable
    ));
  };

  // Get the current location type (country or city)
  const getCurrentLocationType = () => {
    const location = locations.find(loc => loc.name === selectedLocation);
    return location?.type || 'country';
  };

  // Get the H1 title based on location type
  const getH1Title = () => {
    const locationType = getCurrentLocationType();
    if (locationType === 'city') {
      return '{{category_name}} Certification Training in {{city}}';
    } else {
      return '{{category_name}} Certification Training in {{country}}';
    }
  };

  const replaceVariables = (content: string) => {
    let replacedContent = content;
    dynamicVariables.forEach(variable => {
      replacedContent = replacedContent.replace(new RegExp(variable.key.replace(/[{}]/g, '\\$&'), 'g'), variable.value);
    });
    return replacedContent;
  };

  const heroContent = `
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 rounded-lg">
      <h1 class="text-4xl font-bold mb-4">${getH1Title()}</h1>
      <p class="text-xl mb-6">Master {{category_name}} with hands-on training from industry experts in {{city_business_district}}, {{city}}.</p>
      <p class="text-lg mb-4">Available in {{region}} | {{course_count}} courses | Starting from {{currency}}{{price}}</p>
      <p class="text-base mb-4">Training conducted in {{language}} | {{timezone}} timezone | {{city_professionals}} professionals trained</p>
      <p class="text-sm mb-6">📍 Located near {{local_landmarks}} | Easy access from {{transport_hubs}}</p>
      <button class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        Get Started
      </button>
      <div class="text-sm mt-6 space-y-1 opacity-90">
        <p>📞 Call us: {{local_phone}}</p>
        <p>✉️ Email: {{local_email}}</p>
        <p>📍 Visit us: {{office_address}}</p>
        <p>🏢 Serving: {{nearby_cities}} and surrounding areas</p>
      </div>
    </div>
  `;

  const testimonialsContent = `
    <div class="testimonials-section bg-white p-8 rounded-lg border">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">What Our {{country}} Students Say</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="testimonial bg-gray-50 p-6 rounded-lg">
          <p class="text-gray-700 mb-4">"Excellent {{category_name}} training in {{city_business_district}}! The location was perfect - just minutes from {{transport_hubs}}. The instructors were knowledgeable and the hands-on approach really helped."</p>
          <div class="author">
            <p class="font-semibold text-gray-900">John Doe</p>
            <p class="text-gray-600">Senior Developer at {{local_companies}}</p>
          </div>
        </div>
        <div class="testimonial bg-gray-50 p-6 rounded-lg">
          <p class="text-gray-700 mb-4">"Highly recommended! The {{category_name}} certification course from {{company_name}} in {{city}} exceeded my expectations. Great support in {{language}} and convenient for professionals across {{metro_area}}!"</p>
          <div class="author">
            <p class="font-semibold text-gray-900">Jane Smith</p>
            <p class="text-gray-600">Project Manager, commuting from {{nearby_cities}}</p>
          </div>
        </div>
      </div>
      <div class="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 class="font-semibold text-blue-900 mb-2">Why Choose {{city}} for Your Training?</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p>🏙️ Located in {{city_business_district}} business district</p>
            <p>🚇 Easy access from {{transport_hubs}}</p>
            <p>🏢 {{training_venues}} across the city</p>
          </div>
          <div>
            <p>👥 {{city_professionals}} professionals trained</p>
            <p>🌆 Serving {{metro_area}} ({{city_population}})</p>
            <p>🎯 Near {{local_landmarks}}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const fullPageContent = heroContent + '\n\n' + testimonialsContent;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">Test Page Preview</h2>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <optgroup label="Countries">
                  {locations.filter(loc => loc.type === 'country').map(location => (
                    <option key={location.name} value={location.name}>{location.displayName}</option>
                  ))}
                </optgroup>
                <optgroup label="Cities">
                  {locations.filter(loc => loc.type === 'city').map(location => (
                    <option key={location.name} value={location.name}>{location.displayName}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('preview')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  previewMode === 'preview' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye className="w-4 h-4 inline mr-1" />
                Preview
              </button>
              <button
                onClick={() => setPreviewMode('code')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  previewMode === 'code' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4 inline mr-1" />
                Code
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Variables Panel */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Dynamic Variables</h3>
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </div>
            <div className="space-y-4">
              {dynamicVariables.map((variable, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-purple-600 font-mono">
                      {variable.key}
                    </code>
                  </div>
                  <input
                    type="text"
                    value={variable.value}
                    onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">{variable.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Panel */}
          <div className="flex-1 overflow-y-auto">
            {previewMode === 'preview' ? (
              <div className="p-6 space-y-6">
                {/* Hero Section Preview */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 rounded-lg">
                  <h1 className="text-4xl font-bold mb-4">
                    {replaceVariables(getH1Title())}
                  </h1>
                  <p className="text-xl mb-6">
                    {replaceVariables('Master {{category_name}} with hands-on training from industry experts in {{city_business_district}}, {{city}}.')}
                  </p>
                  <p className="text-lg mb-4">
                    {replaceVariables('Available in {{region}} | {{course_count}} courses | Starting from {{currency}}{{price}}')}
                  </p>
                  <p className="text-base mb-4">
                    {replaceVariables('Training conducted in {{language}} | {{timezone}} timezone | {{city_professionals}} professionals trained')}
                  </p>
                  <p className="text-sm mb-6">
                    {replaceVariables('📍 Located near {{local_landmarks}} | Easy access from {{transport_hubs}}')}
                  </p>
                  <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Get Started
                  </button>
                  <div className="text-sm mt-6 space-y-1 opacity-90">
                    <p>{replaceVariables('📞 Call us: {{local_phone}}')}</p>
                    <p>{replaceVariables('✉️ Email: {{local_email}}')}</p>
                    <p>{replaceVariables('📍 Visit us: {{office_address}}')}</p>
                    <p>{replaceVariables('🏢 Serving: {{nearby_cities}} and surrounding areas')}</p>
                  </div>
                </div>

                {/* Testimonials Section Preview */}
                <div className="bg-white p-8 rounded-lg border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {replaceVariables('What Our {{country}} Students Say')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        {replaceVariables('"Excellent {{category_name}} training in {{city_business_district}}, {{city}}! The location was perfect - just minutes from {{transport_hubs}}. The instructors were knowledgeable and the hands-on approach really helped."')}
                      </p>
                      <div>
                        <p className="font-semibold text-gray-900">John Doe</p>
                        <p className="text-gray-600">
                          {replaceVariables('Senior Developer at one of {{local_companies}}')}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        {replaceVariables('"Highly recommended! The {{category_name}} certification course from {{company_name}} in {{country}} exceeded my expectations. Great support in {{language}} and convenient for professionals across {{metro_area}}!"')}
                      </p>
                      <div>
                        <p className="font-semibold text-gray-900">Jane Smith</p>
                        <p className="text-gray-600">
                          {replaceVariables('Project Manager from {{nearby_cities}}')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      {replaceVariables('Why Choose {{country}} for Your Training?')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                      <div>
                        <p>{replaceVariables('🏙️ Located in {{city_business_district}} business district')}</p>
                        <p>{replaceVariables('🚇 Easy access from {{transport_hubs}}')}</p>
                        <p>{replaceVariables('🏢 {{training_venues}} across {{city}}')}</p>
                      </div>
                      <div>
                        <p>{replaceVariables('👥 {{city_professionals}} professionals trained')}</p>
                        <p>{replaceVariables('🌆 Serving {{metro_area}} ({{city_population}})')}</p>
                        <p>{replaceVariables('🎯 Near {{local_landmarks}}')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    {replaceVariables(fullPageContent)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Preview for:</span> {selectedLocation} ({getCurrentLocationType()}) | 
              <span className="ml-2 font-medium">Variables:</span> {dynamicVariables.length} active
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Export HTML
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Publish Test Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPagePreview;