# Database Configuration

This CMS project uses **browser localStorage** as its data storage mechanism instead of a traditional database. This approach provides several benefits for a demo/prototype application:

## Storage Mechanism

### **localStorage Keys Used:**
- `createdPages` - Stores all pages created through the CMS
- `domainSettings` - Stores domain and URL configuration
- `siteSettings` - Stores general site settings
- `isAuthenticated` - Stores authentication state
- `currentUser` - Stores current user information
- `generatedPages` - Stores pages generated from templates

## Data Structures

### **1. Created Pages (`createdPages`)**
```json
[
  {
    "id": "page-1704376615000-abc123def",
    "title": "DevOps Training in New York",
    "slug": "devops-training-new-york",
    "description": "Master DevOps with hands-on training",
    "h1": "DevOps Certification Training in New York",
    "content": "Complete course content with **markdown** formatting",
    "status": "draft|published|archived",
    "author": "Current User",
    "createdDate": "2024-01-04T10:30:15.000Z",
    "lastModified": "2024-01-04T10:30:15.000Z",
    "views": 0,
    "url": "https://example.com/devops-training-new-york"
  }
]
```

### **2. Domain Settings (`domainSettings`)**
```json
{
  "primaryDomain": "prince2cert.com",
  "customDomains": ["training.prince2cert.com", "learn.prince2cert.com"],
  "sslEnabled": true,
  "wwwRedirect": true
}
```

### **3. Site Settings (`siteSettings`)**
```json
{
  "siteName": "Prince2Cert",
  "siteDescription": "Professional Training and Certification Courses",
  "defaultLanguage": "English",
  "timezone": "UTC",
  "contactEmail": "info@prince2cert.com"
}
```

### **4. Generated Pages (`generatedPages`)**
```json
[
  {
    "id": "PG1704376615000-xyz789abc",
    "title": "DevOps Training - New York, United States",
    "url": "https://prince2cert.com/united-states/new-york/devops-training",
    "template": "DevOps Training Template",
    "status": "published",
    "publishedDate": "2024-01-04",
    "lastModified": "2024-01-04",
    "views": 0,
    "countries": ["United States"],
    "cities": ["New York"],
    "author": "System Generated",
    "category": "Generated Page",
    "generatedFrom": "DevOps Training Template"
  }
]
```

## Data Operations

### **Create Operations**
```javascript
// Create a new page
const newPage = {
  id: `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  title: pageData.title,
  slug: pageData.slug,
  // ... other fields
};

const existingPages = JSON.parse(localStorage.getItem('createdPages') || '[]');
const updatedPages = [...existingPages, newPage];
localStorage.setItem('createdPages', JSON.stringify(updatedPages));
```

### **Read Operations**
```javascript
// Load all pages
const pages = JSON.parse(localStorage.getItem('createdPages') || '[]');

// Find specific page by slug
const page = pages.find(p => p.slug === targetSlug);
```

### **Update Operations**
```javascript
// Update page status
const updatedPages = pages.map(page =>
  page.id === pageId
    ? { ...page, status: newStatus, lastModified: new Date().toISOString() }
    : page
);
localStorage.setItem('createdPages', JSON.stringify(updatedPages));
```

### **Delete Operations**
```javascript
// Delete a page
const updatedPages = pages.filter(page => page.id !== pageId);
localStorage.setItem('createdPages', JSON.stringify(updatedPages));
```

## Event System

### **Custom Events for Data Synchronization**
```javascript
// Dispatch events when data changes
window.dispatchEvent(new CustomEvent('pageCreated', { detail: newPage }));
window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: { domainSettings, siteSettings } }));
window.dispatchEvent(new CustomEvent('pagesGenerated', { detail: newPages }));

// Listen for events in components
window.addEventListener('pageCreated', handlePageCreated);
window.addEventListener('settingsUpdated', handleSettingsUpdate);
```

## Dynamic Variables System

### **Variable Replacement Logic**
```javascript
const replaceVariables = (content) => {
  const domainSettings = JSON.parse(localStorage.getItem('domainSettings') || '{}');
  const siteSettings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
  
  let replacedContent = content;
  
  // Replace variables
  replacedContent = replacedContent.replace(/\{\{company_name\}\}/g, siteSettings.siteName || 'Prince2Cert');
  replacedContent = replacedContent.replace(/\{\{country\}\}/g, 'United States');
  replacedContent = replacedContent.replace(/\{\{city\}\}/g, 'New York');
  // ... more replacements
  
  return replacedContent;
};
```

### **Available Dynamic Variables**
```javascript
const dynamicVariables = [
  { key: '{{company_name}}', description: 'Company brand name', example: 'Prince2Cert' },
  { key: '{{category_name}}', description: 'Training category', example: 'DevOps' },
  { key: '{{country}}', description: 'Target country', example: 'United States' },
  { key: '{{city}}', description: 'Primary city', example: 'New York' },
  { key: '{{currency}}', description: 'Local currency symbol', example: '$' },
  { key: '{{price}}', description: 'Course price', example: '2,499' },
  // ... more variables
];
```

## Migration to Real Database

### **If you want to migrate to a real database later:**

#### **1. PostgreSQL Schema**
```sql
-- Pages table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  h1 TEXT,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  author TEXT,
  created_date TIMESTAMPTZ DEFAULT now(),
  last_modified TIMESTAMPTZ DEFAULT now(),
  views INTEGER DEFAULT 0,
  url TEXT
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Dynamic variables table
CREATE TABLE dynamic_variables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  default_value TEXT,
  category TEXT,
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### **2. Supabase Integration**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Create page
const { data, error } = await supabase
  .from('pages')
  .insert([newPage]);

// Read pages
const { data: pages } = await supabase
  .from('pages')
  .select('*')
  .order('created_date', { ascending: false });
```

## Advantages of Current localStorage Approach

1. **No Backend Required** - Works entirely in the browser
2. **Instant Performance** - No network requests for data operations
3. **Simple Development** - No database setup or configuration needed
4. **Demo-Friendly** - Perfect for prototypes and demonstrations
5. **Offline Capable** - Works without internet connection

## Limitations

1. **Browser-Specific** - Data doesn't sync across browsers/devices
2. **Storage Limits** - Limited to ~5-10MB per domain
3. **No Server-Side Rendering** - Can't pre-render pages with data
4. **No Multi-User** - No real authentication or user management
5. **Data Loss Risk** - Clearing browser data removes all content

## Backup and Export

### **Export Data Function**
```javascript
const exportData = () => {
  const data = {
    pages: JSON.parse(localStorage.getItem('createdPages') || '[]'),
    settings: {
      domain: JSON.parse(localStorage.getItem('domainSettings') || '{}'),
      site: JSON.parse(localStorage.getItem('siteSettings') || '{}')
    },
    generatedPages: JSON.parse(localStorage.getItem('generatedPages') || '[]')
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cms-backup.json';
  a.click();
};
```

This localStorage-based approach provides a fully functional CMS experience without requiring any backend infrastructure, making it perfect for demonstrations and prototypes.