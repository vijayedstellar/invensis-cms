import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TemplateManagement from './components/TemplateManagement';
import ContentBlocksManagement from './components/ContentBlocksManagement';
import DynamicVariablesManagement from './components/DynamicVariablesManagement';
import PagesManagement from './components/PagesManagement';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard</h2>
            <p className="text-gray-600">Dashboard content coming soon...</p>
          </div>
        );
      case 'templates':
        return <TemplateManagement />;
      case 'content-blocks':
        return <ContentBlocksManagement />;
      case 'pages':
        return <PagesManagement />;
      case 'dynamic-variables':
        return <DynamicVariablesManagement />;
      default:
        return <TemplateManagement />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;