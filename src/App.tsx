import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TemplateManagement from './components/TemplateManagement';
import ContentBlocksManagement from './components/ContentBlocksManagement';
import PagesManagement from './components/PagesManagement';
import DynamicVariablesManagement from './components/DynamicVariablesManagement';

function App() {
  const [activeView, setActiveView] = useState('templates');

  const renderMainContent = () => {
    switch (activeView) {
      case 'templates':
        return <TemplateManagement />;
      case 'content-blocks':
        return <ContentBlocksManagement />;
      case 'pages':
        return <PagesManagement />;
      case 'dynamic-variables':
        return <DynamicVariablesManagement />;
      case 'dashboard':
        return (
          <div className="flex-1 bg-gray-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-gray-600">Dashboard content coming soon...</p>
          </div>
        );
      default:
        return <TemplateManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col">
        <Header />
        {renderMainContent()}
      </div>
    </div>
  );
}

export default App;