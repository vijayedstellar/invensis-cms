import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Page } from '../db/schema';


interface PageRendererProps {
  page: {
    id: string;
    title: string;
    h1?: string;
    description?: string;
    content?: string;
    createdDate: string;
    lastModified: string;
    views: number;
    author: string;
    status: string;
  };
}

export default function PageRenderer({ page }: PageRendererProps) {
  const [processedContent, setProcessedContent] = useState('');
  const [variables, setVariables] = useState<Record<string, string>>({});

  // Load dynamic variables
  useEffect(() => {
    const savedVariables = localStorage.getItem('dynamicVariables');
    if (savedVariables) {
      setVariables(JSON.parse(savedVariables));
    }
  }, []);

  // Process content and replace variables
  useEffect(() => {
    if (page.content) {
      let content = page.content;
      
      // Replace dynamic variables
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        content = content.replace(regex, value);
      });
      
      // Replace default variables
      const defaultVariables = {
        company_name: 'Prince2Cert',
        category_name: 'Prince2',
        country: 'United States',
        city: 'New York',
        currency: '$',
        price: '2,499',
        course_count: '25+'
      };
      
      Object.entries(defaultVariables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        content = content.replace(regex, value);
      });
      
      setProcessedContent(content);
    }
  }, [page.content, variables]);

  // Increment view count when page is viewed
  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        // Try to increment view count via API
        await apiService.getPage(page.id);
      } catch (error) {
        console.warn('Failed to increment view count via API, using localStorage fallback');
        // Fallback to localStorage
        const createdPages = JSON.parse(localStorage.getItem('createdPages') || '[]');
        const updatedPages = createdPages.map((p: any) => 
          p.id === page.id ? { ...p, views: (p.views || 0) + 1 } : p
        );
        localStorage.setItem('createdPages', JSON.stringify(updatedPages));
      }
    };
    
    incrementViewCount();
  }, [page.id]);

  // Convert content to HTML (basic markdown-like conversion)
  const convertToHTML = (content: string) => {
    let html = content;
    
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
      <title>{page.title}</title>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        {page.h1 && (
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {page.h1}
            </h1>
            {page.description && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {page.description}
              </p>
            )}
          </header>
        )}
        
        {/* Page Content */}
        {processedContent && (
          <main className="prose prose-lg max-w-none">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: convertToHTML(processedContent)
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
              <span>Status: {page.status}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}