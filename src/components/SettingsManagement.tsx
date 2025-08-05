import React, { useState, useEffect } from 'react';
import { Save, Globe, Link, Shield, Bell, User, Palette, Database, Key, CheckCircle, AlertCircle } from 'lucide-react';

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

const SettingsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('domain');
  const [domainSettings, setDomainSettings] = useState<DomainSettings>({
    primaryDomain: 'example.com',
    customDomains: [],
    sslEnabled: true,
    wwwRedirect: true
  });
  
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: 'Invensis Learning',
    siteDescription: 'Professional Training and Certification Courses',
    defaultLanguage: 'English',
    timezone: 'UTC',
    contactEmail: 'info@invensislearning.com'
  });

  const [newDomain, setNewDomain] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const tabs = [
    { id: 'domain', label: 'Domain & URLs', icon: Globe },
    { id: 'site', label: 'Site Settings', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedDomainSettings = localStorage.getItem('domainSettings');
    const savedSiteSettings = localStorage.getItem('siteSettings');
    
    if (savedDomainSettings) {
      setDomainSettings(JSON.parse(savedDomainSettings));
    }
    
    if (savedSiteSettings) {
      setSiteSettings(JSON.parse(savedSiteSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    
    // Save to localStorage
    localStorage.setItem('domainSettings', JSON.stringify(domainSettings));
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
    
    // Update existing pages with new domain
    const existingPages = JSON.parse(localStorage.getItem('createdPages') || '[]');
    const updatedPages = existingPages.map((page: any) => ({
      ...page,
      url: `https://${domainSettings.primaryDomain}/${page.slug || 'untitled-page'}`
    }));
    localStorage.setItem('createdPages', JSON.stringify(updatedPages));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('settingsUpdated', { 
      detail: { domainSettings, siteSettings } 
    }));
    
    // Simulate save delay
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleAddCustomDomain = () => {
    if (newDomain && !domainSettings.customDomains.includes(newDomain)) {
      setDomainSettings(prev => ({
        ...prev,
        customDomains: [...prev.customDomains, newDomain]
      }));
      setNewDomain('');
    }
  };

  const handleRemoveCustomDomain = (domain: string) => {
    setDomainSettings(prev => ({
      ...prev,
      customDomains: prev.customDomains.filter(d => d !== domain)
    }));
  };

  const renderDomainSettings = () => (
    <div className="space-y-6">
      {/* Primary Domain */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-blue-600" />
          Primary Domain
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domain Name
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">https://</span>
              <input
                type="text"
                value={domainSettings.primaryDomain}
                onChange={(e) => setDomainSettings(prev => ({ ...prev, primaryDomain: e.target.value }))}
                placeholder="yourdomain.com"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This will be the primary domain for all your pages
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={domainSettings.sslEnabled}
                onChange={(e) => setDomainSettings(prev => ({ ...prev, sslEnabled: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable SSL (HTTPS)</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={domainSettings.wwwRedirect}
                onChange={(e) => setDomainSettings(prev => ({ ...prev, wwwRedirect: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Redirect www to non-www</span>
            </label>
          </div>
        </div>
      </div>

      {/* Custom Domains */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Link className="w-5 h-5 mr-2 text-green-600" />
          Custom Domains
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="custom-domain.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCustomDomain()}
            />
            <button
              onClick={handleAddCustomDomain}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Domain
            </button>
          </div>
          
          {domainSettings.customDomains.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Added Domains:</p>
              {domainSettings.customDomains.map((domain, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-900">https://{domain}</span>
                  <button
                    onClick={() => handleRemoveCustomDomain(domain)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* URL Preview */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">URL Preview</h4>
        <p className="text-sm text-blue-800">
          Your pages will be accessible at: <code className="bg-blue-100 px-2 py-1 rounded">
            https://{domainSettings.primaryDomain}/[page-slug]
          </code>
        </p>
      </div>
    </div>
  );

  const renderSiteSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-purple-600" />
          General Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={siteSettings.siteName}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Language
            </label>
            <select
              value={siteSettings.defaultLanguage}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, defaultLanguage: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Japanese">Japanese</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={siteSettings.timezone}
              onChange={(e) => setSiteSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">Greenwich Mean Time</option>
              <option value="CET">Central European Time</option>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-red-600" />
          Security Settings
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Security settings will be available in the full version. 
              Current features include basic SSL configuration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">SSL Certificate</h4>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Domain Verification</h4>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-600">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-indigo-600" />
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Coming Soon:</strong> Email notifications, webhook integrations, 
              and real-time alerts will be available in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Configure your CMS and domain settings</p>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={saveStatus === 'saving'}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              saveStatus === 'saved' 
                ? 'bg-green-600 text-white' 
                : saveStatus === 'saving'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {saveStatus === 'saving' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : saveStatus === 'saved' ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'notifications' && renderNotificationSettings()}
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;