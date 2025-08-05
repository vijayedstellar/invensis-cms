import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase, initializeDatabase, handleDatabaseError, testConnection } from '../lib/db';
import { pages } from '../lib/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  try {
    console.log('API Request:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.method === 'POST' ? req.body : 'N/A'
    });

    // Test database connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      console.error('Database connection test failed:', connectionTest.error);
      return res.status(503).json({
        success: false,
        error: 'Database connection failed',
        details: connectionTest.error,
        fallback: 'Please use localStorage fallback'
      });
    }

    // Initialize database tables
    const initResult = await initializeDatabase();
    if (!initResult.success) {
      console.error('Database initialization failed:', initResult.error);
      return res.status(503).json({
        success: false,
        error: 'Database initialization failed',
        details: initResult.error,
        fallback: 'Please use localStorage fallback'
      });
    }

    const { db, isConnected } = getDatabase();
    
    if (!isConnected || !db) {
      return res.status(503).json({
        success: false,
        error: 'Database not available',
        fallback: 'Please use localStorage fallback'
      });
    }

    if (req.method === 'GET') {
      console.log('Fetching all pages...');
      
      try {
        const allPages = await db
          .select()
          .from(pages)
          .orderBy(desc(pages.createdAt));

        console.log(`Successfully fetched ${allPages.length} pages`);

        return res.status(200).json({
          success: true,
          data: allPages,
          count: allPages.length,
          message: 'Pages fetched successfully'
        });
      } catch (dbError) {
        console.error('Database query error:', dbError);
        const errorResponse = handleDatabaseError(dbError);
        
        return res.status(errorResponse.status).json({
          success: false,
          error: errorResponse.error,
          fallback: 'Please use localStorage fallback'
        });
      }
    }

    if (req.method === 'POST') {
      console.log('Creating new page...');
      
      try {
        const { title, slug, description, h1, content, status, author } = req.body;

        // Validate required fields
        if (!title || !slug) {
          return res.status(400).json({
            success: false,
            error: 'Title and slug are required',
            details: 'Missing required fields'
          });
        }

        // Validate slug format
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.',
            details: 'Slug validation failed'
          });
        }

        const newPage = {
          title: String(title).trim(),
          slug: String(slug).trim().toLowerCase(),
          description: description ? String(description).trim() : '',
          h1: h1 ? String(h1).trim() : '',
          content: content ? String(content).trim() : '',
          status: status || 'draft',
          author: author ? String(author).trim() : 'Unknown',
          url: `/${String(slug).trim().toLowerCase()}`,
          views: 0
        };

        console.log('Creating page with data:', newPage);

        const [createdPage] = await db
          .insert(pages)
          .values(newPage)
          .returning();

        console.log('Page created successfully:', createdPage.id);

        return res.status(201).json({
          success: true,
          data: createdPage,
          message: 'Page created successfully'
        });
      } catch (dbError) {
        console.error('Database insert error:', dbError);
        const errorResponse = handleDatabaseError(dbError);
        
        return res.status(errorResponse.status).json({
          success: false,
          error: errorResponse.error,
          details: dbError instanceof Error ? dbError.message : 'Unknown error'
        });
      }
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
      allowedMethods: ['GET', 'POST', 'OPTIONS']
    });

  } catch (error: any) {
    console.error('Unhandled API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred',
      fallback: 'Please use localStorage fallback'
    });
  }
}