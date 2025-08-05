import React from 'react';

interface Page {
  id: string;
  title: string;
  slug: string;
  description: string;
  h1: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  createdDate: string;
  lastModified: string;
  views: number;
  url: string;
}

interface PageRendererProps {
  page: Page;
}

const PageRenderer: React.FC<PageRendererProps> = ({ page }) => {
  // Update view count when page is viewed
  React.useEffect(() => {
    const updateViewCount = () => {
      const createdPages = JSON.parse(localStorage.getItem('createdPages') || '[]');
      const updatedPages = createdPages.map((p: Page) => 
        p.id === page.id ? { ...p, views: p.views + 1 } : p
      );
      localStorage.setItem('createdPages', JSON.stringify(updatedPages));
    };

    updateViewCount();
  }, [page.id]);

  // Function to replace variables with actual values (basic implementation)
  const replaceVariables = (content: string) => {
    // Get domain settings for variable replacement
    const domainSettings = JSON.parse(localStorage.getItem('domainSettings') || '{"primaryDomain": "example.com"}');
    const siteSettings = JSON.parse(localStorage.getItem('siteSettings') || '{"siteName": "Prince2Cert"}');
    
    let replacedContent = content;
    
    // Replace common variables
    replacedContent = replacedContent.replace(/\{\{company_name\}\}/g, siteSettings.siteName || 'Prince2Cert');
    replacedContent = replacedContent.replace(/\{\{category_name\}\}/g, 'Prince2');
    replacedContent = replacedContent.replace(/\{\{country\}\}/g, 'United States');
    replacedContent = replacedContent.replace(/\{\{city\}\}/g, 'New York');
    replacedContent = replacedContent.replace(/\{\{currency\}\}/g, '$');
    replacedContent = replacedContent.replace(/\{\{price\}\}/g, '2,499');
    replacedContent = replacedContent.replace(/\{\{course_count\}\}/g, '25+');
    
    return replacedContent;
  };

  // Convert content to HTML (basic markdown-like conversion)
  const convertToHTML = (content: string) => {
    let html = replaceVariables(content);
    
    // Convert markdown-style formatting to HTML
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>');
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />');
    
    // Convert bullet points
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc pl-6 my-4">$1</ul>');
    
    // Convert line breaks
    html = html.replace(/\n/g, '<br />');
    
    return html;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags would go here in a real implementation */}
      <title>{replaceVariables(page.title)}</title>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        {page.h1 && (
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {replaceVariables(page.h1)}
            </h1>
            {page.description && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {replaceVariables(page.description)}
              </p>
            )}
          </header>
        )}
        
        {/* Page Content */}
        {page.content && (
          <main className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: convertToHTML(page.content)
              }}
            />
          </main>
        )}
        
        {/* Page Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Published: {new Date(page.createdDate).toLocaleDateString()}</span>
              {page.lastModified !== page.createdDate && (
                <span>Updated: {new Date(page.lastModified).toLocaleDateString()}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span>Views: {page.views}</span>
              <span>Author: {page.author}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PageRenderer;