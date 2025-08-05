import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase, initializeDatabase, handleDatabaseError, testConnection } from '../lib/db';
import { pages } from '../lib/schema';
import { eq } from 'drizzle-orm';

async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  try {
    const { id } = req.query;

    console.log('API Request:', {
      method: req.method,
      id: id,
      body: req.method !== 'GET' ? req.body : 'N/A'
    });

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Page ID is required and must be a string',
        details: 'Invalid or missing page ID'
      });
    }

    // Test database connection
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

    // Initialize database
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
      console.log(`Fetching page with ID: ${id}`);
      
      try {
        const [page] = await db
          .select()
          .from(pages)
          .where(eq(pages.id, id));

        if (!page) {
          return res.status(404).json({
            success: false,
            error: 'Page not found',
            details: `No page found with ID: ${id}`
          });
        }

        // Increment view count
        const [updatedPage] = await db
          .update(pages)
          .set({ 
            views: (page.views || 0) + 1,
            updatedAt: new Date()
          })
          .where(eq(pages.id, id))
          .returning();

        console.log(`Page fetched and view count updated: ${id}`);

        return res.status(200).json({
          success: true,
          data: updatedPage || { ...page, views: (page.views || 0) + 1 },
          message: 'Page fetched successfully'
        });
      } catch (dbError) {
        console.error('Database query error:', dbError);
        const errorResponse = handleDatabaseError(dbError);
        
        return res.status(errorResponse.status).json({
          success: false,
          error: errorResponse.error,
          details: dbError instanceof Error ? dbError.message : 'Unknown error'
        });
      }
    }

    if (req.method === 'PUT') {
      console.log(`Updating page with ID: ${id}`);
      
      try {
        const { title, slug, description, h1, content, status, author } = req.body;

        const updateData: any = {
          updatedAt: new Date()
        };

        // Only update provided fields
        if (title !== undefined) updateData.title = String(title).trim();
        if (slug !== undefined) {
          const slugValue = String(slug).trim().toLowerCase();
          const slugRegex = /^[a-z0-9-]+$/;
          if (!slugRegex.test(slugValue)) {
            return res.status(400).json({
              success: false,
              error: 'Invalid slug format. Use only lowercase letters, numbers, and hyphens.',
              details: 'Slug validation failed'
            });
          }
          updateData.slug = slugValue;
        }
        if (description !== undefined) updateData.description = String(description).trim();
        if (h1 !== undefined) updateData.h1 = String(h1).trim();
        if (content !== undefined) updateData.content = String(content).trim();
        if (status !== undefined) updateData.status = status;
        if (author !== undefined) updateData.author = String(author).trim();

        console.log('Updating page with data:', updateData);

        const [updatedPage] = await db
          .update(pages)
          .set(updateData)
          .where(eq(pages.id, id))
          .returning();

        if (!updatedPage) {
          return res.status(404).json({
            success: false,
            error: 'Page not found',
            details: `No page found with ID: ${id}`
          });
        }

        console.log(`Page updated successfully: ${id}`);

        return res.status(200).json({
          success: true,
          data: updatedPage,
          message: 'Page updated successfully'
        });
      } catch (dbError) {
        console.error('Database update error:', dbError);
        const errorResponse = handleDatabaseError(dbError);
        
        return res.status(errorResponse.status).json({
          success: false,
          error: errorResponse.error,
          details: dbError instanceof Error ? dbError.message : 'Unknown error'
        });
      }
    }

    if (req.method === 'DELETE') {
      console.log(`Deleting page with ID: ${id}`);
      
      try {
        const [deletedPage] = await db
          .delete(pages)
          .where(eq(pages.id, id))
          .returning();

        if (!deletedPage) {
          return res.status(404).json({
            success: false,
            error: 'Page not found',
            details: `No page found with ID: ${id}`
          });
        }

        console.log(`Page deleted successfully: ${id}`);

        return res.status(200).json({
          success: true,
          message: 'Page deleted successfully',
          data: deletedPage
        });
      } catch (dbError) {
        console.error('Database delete error:', dbError);
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
      allowedMethods: ['GET', 'PUT', 'DELETE', 'OPTIONS']
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