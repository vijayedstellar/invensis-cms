import React, { useState } from 'react';
import { Save, Eye, FileText, Type, AlignLeft, Bold, Italic, Underline, List, Link, Image } from 'lucide-react';

const CreatePagesManagement: React.FC = () => {
  const [domainSettings, setDomainSettings] = useState({ primaryDomain: 'example.com' });
  
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    description: '',
    h1: '',
    content: ''
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Load domain settings and listen for updates
  React.useEffect(() => {
    const loadDomainSettings = () => {
      const saved = localStorage.getItem('domainSettings');
      if (saved) {
        setDomainSettings(JSON.parse(saved));
      }
    };

    loadDomainSettings();

    const handleSettingsUpdate = (event: CustomEvent) => {
      setDomainSettings(event.detail.domainSettings);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);

    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setPageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Get domain settings from localStorage
    const domainSettings = JSON.parse(localStorage.getItem('domainSettings') || '{"primaryDomain": "example.com"}');
    
    // Generate a unique ID for the page
    const pageId = `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Create the page object
    const newPage = {
      id: pageId,
      title: pageData.title || 'Untitled Page',
      slug: pageData.slug || 'untitled-page',
      description: pageData.description || '',
      h1: pageData.h1 || '',
      content: pageData.content || '',
      status: 'draft' as const,
      author: 'Current User', // In a real app, this would come from authentication
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      views: 0,
      url: `https://${domainSettings.primaryDomain}/${pageData.slug || 'untitled-page'}`
    };
    
    // Get existing pages from localStorage
    const existingPages = JSON.parse(localStorage.getItem('createdPages') || '[]');
    
    // Add the new page
    const updatedPages = [...existingPages, newPage];
    
    // Save to localStorage
    localStorage.setItem('createdPages', JSON.stringify(updatedPages));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('pageCreated', { detail: newPage }));
    
    // Show success message
    alert('Page saved successfully!');
    
    // Reset the form
    setPageData({
      title: '',
      slug: '',
      description: '',
      h1: '',
      content: ''
    });
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText || 'underlined text'}</u>`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'list item'}\n- list item 2\n- list item 3`;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      case 'image':
        formattedText = `![${selectedText || 'alt text'}](https://example.com/image.jpg)`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);
    
    handleInputChange('content', newContent);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  const renderPreview = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="max-w-4xl mx-auto">
          {pageData.h1 && (
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {pageData.h1}
            </h1>
          )}
          
          {pageData.description && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {pageData.description}
            </p>
          )}
          
          {pageData.content && (
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: pageData.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
                    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
                    .replace(/^- (.+)$/gm, '<li>$1</li>')
                    .replace(/(<li>.*<\/li>)/s, '<ul class="list-disc pl-6 my-4">$1</ul>')
                    .replace(/\n/g, '<br />')
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Page</h1>
            <p className="text-gray-600">Create a new page with custom content</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePreview}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                isPreviewMode 
                  ? 'bg-gray-600 text-white hover:bg-gray-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Page</span>
            </button>
          </div>
        </div>

        {isPreviewMode ? (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Page Preview</h2>
              <p className="text-sm text-gray-600">This is how your page will look when published</p>
            </div>
            {renderPreview()}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="space-y-6">
                {/* Page Title */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={pageData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter page title (for SEO and browser tab)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will appear in the browser tab and search results</p>
                </div>

                {/* Page Slug */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Page Slug (URL)
                  </label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 bg-gray-50 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg">
                      https://{domainSettings.primaryDomain}/
                    </span>
                    <input
                      type="text"
                      value={pageData.slug}
                      onChange={(e) => {
                        // Auto-format slug: lowercase, replace spaces with hyphens, remove special chars
                        const formattedSlug = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, '')
                          .replace(/\s+/g, '-')
                          .replace(/-+/g, '-');
                        handleInputChange('slug', formattedSlug);
                      }}
                      placeholder="my-page-url"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of your page title. Only lowercase letters, numbers, and hyphens allowed.
                  </p>
                </div>

                {/* Page Description */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <AlignLeft className="w-4 h-4 mr-2" />
                    Page Description
                  </label>
                  <textarea
                    value={pageData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter a brief description of the page content"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">This will appear as a subtitle or meta description</p>
                </div>

                {/* H1 Heading */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Type className="w-4 h-4 mr-2" />
                    Main Heading (H1)
                  </label>
                  <input
                    type="text"
                    value={pageData.h1}
                    onChange={(e) => handleInputChange('h1', e.target.value)}
                    placeholder="Enter the main heading for your page"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-semibold"
                  />
                  <p className="text-xs text-gray-500 mt-1">This is the main heading that visitors will see</p>
                </div>

                {/* Rich Text Editor */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <AlignLeft className="w-4 h-4 mr-2" />
                    Page Content
                  </label>
                  
                  {/* Formatting Toolbar */}
                  <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-3 flex items-center space-x-2">
                    <button
                      onClick={() => insertFormatting('bold')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting('italic')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting('underline')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                    <button
                      onClick={() => insertFormatting('list')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Bullet List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting('link')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Insert Link"
                    >
                      <Link className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => insertFormatting('image')}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                      title="Insert Image"
                    >
                      <Image className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <textarea
                    id="content-editor"
                    value={pageData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your page content here. You can use the formatting buttons above or type markdown-style formatting:

**Bold text**
*Italic text*
[Link text](https://example.com)
![Image alt text](https://example.com/image.jpg)
- Bullet point 1
- Bullet point 2"
                    rows={15}
                    className="w-full px-4 py-3 border-l border-r border-b border-gray-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Use the toolbar buttons or type markdown formatting directly
                    </p>
                    <p className="text-xs text-gray-500">
                      {pageData.content.length} characters
                    </p>
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Formatting Tips:</h3>
                  <div className="text-xs text-blue-800 space-y-1">
                    <p>• Use **text** for bold, *text* for italic</p>
                    <p>• Create links with [link text](URL)</p>
                    <p>• Add images with ![alt text](image URL)</p>
                    <p>• Start lines with - for bullet points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePagesManagement;