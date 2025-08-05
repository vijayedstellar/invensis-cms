import React, { useState, useEffect } from 'react';
import { Save, Globe, Shield, Database, Settings as SettingsIcon } from 'lucide-react';
import { apiService } from '../services/api';

interface DomainSettings {
  primaryDomain: string;
  customDomains: string[];
  sslEnabled: boolean;
  wwwRedirect: boolean;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  defaultLanguage: string;
  timezone: string;
  contactEmail: string;
}

export default function SettingsManagement() {
  const [domainSettings, setDomainSettings] = useState<DomainSettings>({
    primaryDomain: '',
    customDomains: [],
    sslEnabled: true,
    wwwRedirect: true
  });
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: '',
    siteDescription: '',
    defaultLanguage: 'English',
    timezone: 'UTC',
    contactEmail: ''
  });

  const [activeTab, setActiveTab] = useState('domain');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  // Load settings from storage
  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getSettings();
      
      if (response.success && response.data) {
        // Extract settings from API response
        if (response.data.domainSettings) {
          setDomainSettings(response.data.domainSettings);
        }
        if (response.data.siteSettings) {
          setSiteSettings(response.data.siteSettings);
        }
      } else {
        // Fallback to localStorage if API fails
        console.warn('API failed, falling back to localStorage:', response.error);
        const savedDomainSettings = localStorage.getItem('domainSettings');
        const savedSiteSettings = localStorage.getItem('siteSettings');
        
        if (savedDomainSettings) {
          setDomainSettings(JSON.parse(savedDomainSettings));
        }
        if (savedSiteSettings) {
          setSiteSettings(JSON.parse(savedSiteSettings));
        }
        setError('Using offline data - some features may be limited');
      }
    } catch (error: any) {
      console.error('Failed to load settings:', error);
      // Fallback to localStorage
      const savedDomainSettings = localStorage.getItem('domainSettings');
      const savedSiteSettings = localStorage.getItem('siteSettings');
      
      if (savedDomainSettings) {
        setDomainSettings(JSON.parse(savedDomainSettings));
      }
      if (savedSiteSettings) {
        setSiteSettings(JSON.parse(savedSiteSettings));
      }
      setError('Failed to connect to server - using offline data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDomainSettings = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await apiService.updateSettings({
        domainSettings: domainSettings
      });
      
      if (response.success) {
        // Also save to localStorage as backup
        localStorage.setItem('domainSettings', JSON.stringify(domainSettings));
        setSuccessMessage('Domain settings saved successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to save domain settings');
      }
    } catch (error: any) {
      console.error('Failed to save domain settings:', error);
      setError('Failed to save domain settings - please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSiteSettings = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await apiService.updateSettings({
        siteSettings: siteSettings
      });
      
      if (response.success) {
        // Also save to localStorage as backup
        localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
        setSuccessMessage('Site settings saved successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to save site settings');
      }
    } catch (error: any) {
      console.error('Failed to save site settings:', error);
      setError('Failed to save site settings - please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDomainSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Domain Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Domain
            </label>
            <input
              type="text"
              value={domainSettings.primaryDomain}
              onChange={(e) => setDomainSettings(prev => ({ ...prev, primaryDomain: e.target.value }))}
              placeholder="yourdomain.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={domainSettings.sslEnabled}
                onChange={(e) => setDomainSettings(prev => ({ ...prev, sslEnabled: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Enable SSL (HTTPS)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={domainSettings.wwwRedirect}
                onChange={(e) => setDomainSettings(prev => ({ ...prev, wwwRedirect: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Redirect www to non-www</span>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSaveDomainSettings}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Domain Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSiteSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <SettingsIcon className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Site Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={siteSettings.siteName}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={siteSettings.contactEmail}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Language
            </label>
            <select
              value={siteSettings.defaultLanguage}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, defaultLanguage: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={siteSettings.timezone}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">Greenwich Mean Time</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Description
          </label>
          <textarea
            value={siteSettings.siteDescription}
            onChange={(e) => setSiteSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6">
          <button
            onClick={handleSaveSiteSettings}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Site Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Database className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Database Configuration</h3>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Database settings are currently managed automatically. 
            Manual configuration will be available in future updates.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-red-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            <strong>Coming Soon:</strong> Advanced security features including API keys, 
            access controls, and audit logs will be available in future updates.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your CMS and domain settings</p>
          
          {/* Status Messages */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          
          {isLoading && (
            <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              Saving settings...
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'domain', label: 'Domain', icon: Globe },
                { id: 'site', label: 'Site', icon: SettingsIcon },
                { id: 'database', label: 'Database', icon: Database },
                { id: 'security', label: 'Security', icon: Shield }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'domain' && renderDomainSettings()}
          {activeTab === 'site' && renderSiteSettings()}
          {activeTab === 'database' && renderDatabaseSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
        </div>
      </div>
    </div>
  );
}