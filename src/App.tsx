import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TemplateManagement from './components/TemplateManagement';
import ContentBlocksManagement from './components/ContentBlocksManagement';
import CreatePagesManagement from './components/CreatePagesManagement';
import PagesManagement from './components/PagesManagement';
import DynamicVariablesManagement from './components/DynamicVariablesManagement';
import SettingsManagement from './components/SettingsManagement';
import PageRenderer from './components/PageRenderer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('templates');
  const [currentRoute, setCurrentRoute] = useState('/');

  const handleLogin = (credentials: { username: string; password: string }) => {
    // Simple authentication check - in a real app, this would validate against a backend
    if (credentials.username && credentials.password) {
      setIsAuthenticated(true);
      // Store authentication state in localStorage for persistence
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', credentials.username);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    setCurrentRoute('/');
  };

  // Check authentication state on app load
  React.useEffect(() => {
    const authState = localStorage.getItem('isAuthenticated');
    if (authState === 'true') {
      setIsAuthenticated(true);
    }
    
    // Simple routing based on URL path
    const path = window.location.pathname || '/';
    setCurrentRoute(path);
    
    // Listen for URL changes
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check if current route matches a created page
  const getCreatedPage = () => {
    const currentPath = (currentRoute || '/').toLowerCase();
    const createdPages = JSON.parse(localStorage.getItem('createdPages') || '[]');
    return createdPages.find((page: any) => {
      const pageSlug = `/${page.slug}`;
      return pageSlug === currentPath || pageSlug === currentPath.replace(/\/$/, '');
    });
  };

  const [matchedPage, setMatchedPage] = useState<any>(null);

  // Handle page lookup
  React.useEffect(() => {
    if (currentRoute && currentRoute !== '/' && !currentRoute.startsWith('/admin')) {
      setMatchedPage(getCreatedPage());
    } else {
      setMatchedPage(null);
    }
  }, [currentRoute]);

  // Handle different routes
  if (currentRoute === '/') {
    // Home page - empty page
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to Prince2Cert
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xl md:text-2xl text-gray-600 font-medium mb-8">
            Your Official Training Partner for Prince2 Certification
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Accredited Training</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Expert Instructors</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Global Recognition</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Check if this is a created page route
  if (matchedPage) {
    return <PageRenderer page={matchedPage} />;
  }
  
  if (currentRoute === '/admin') {
    // Admin area - show login page if not authenticated
    if (!isAuthenticated) {
      return <LoginPage onLogin={handleLogin} />;
    }
  }
  
  // If not authenticated and trying to access admin, redirect to login
  if (currentRoute.startsWith('/admin') && !isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  // If authenticated but not in admin area, redirect to admin
  if (isAuthenticated && !currentRoute.startsWith('/admin')) {
    setCurrentRoute('/admin');
    window.history.pushState({}, '', '/admin');
  }

  // If no route matches, show 404
  if (!currentRoute.startsWith('/admin') && !matchedPage && currentRoute !== '/') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page not found</p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }
  const renderMainContent = () => {
    switch (activeView) {
      case 'templates':
        return <TemplateManagement />;
      case 'content-blocks':
        return <ContentBlocksManagement />;
      case 'create-pages':
        return <CreatePagesManagement />;
      case 'pages':
        return <PagesManagement />;
      case 'dynamic-variables':
        return <DynamicVariablesManagement />;
      case 'settings':
        return <SettingsManagement />;
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
        <Header onLogout={handleLogout} />
        {renderMainContent()}
      </div>
    </div>
  );
}

export default App;