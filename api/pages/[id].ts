import { VercelRequest, VercelResponse } from '@vercel/node';
import { db, initializeDatabase, handleDatabaseError } from '../lib/db';
import { pages } from '../lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Page ID is required'
    });
  }

  try {
    await initializeDatabase();

    if (req.method === 'GET') {
      // Fetch single page by ID
      const [page] = await db
        .select()
        .from(pages)
        .where(eq(pages.id, id));

      if (!page) {
        return res.status(404).json({
          success: false,
          error: 'Page not found'
        });
      }

      // Increment view count
      await db
        .update(pages)
        .set({ 
          views: (page.views || 0) + 1,
          updatedAt: new Date()
        })
        .where(eq(pages.id, id));

      return res.status(200).json({
        success: true,
        data: { ...page, views: (page.views || 0) + 1 }
      });
    }

    if (req.method === 'PUT') {
      // Update existing page
      const { title, slug, description, h1, content, status, author } = req.body;

      const updateData: any = {
        updatedAt: new Date()
      };

      if (title !== undefined) updateData.title = title;
      if (slug !== undefined) updateData.slug = slug;
      if (description !== undefined) updateData.description = description;
      if (h1 !== undefined) updateData.h1 = h1;
      if (content !== undefined) updateData.content = content;
      if (status !== undefined) updateData.status = status;
      if (author !== undefined) updateData.author = author;

      const [updatedPage] = await db
        .update(pages)
        .set(updateData)
        .where(eq(pages.id, id))
        .returning();

      if (!updatedPage) {
        return res.status(404).json({
          success: false,
          error: 'Page not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedPage
      });
    }

    if (req.method === 'DELETE') {
      // Delete page
      const [deletedPage] = await db
        .delete(pages)
        .where(eq(pages.id, id))
        .returning();

      if (!deletedPage) {
        return res.status(404).json({
          success: false,
          error: 'Page not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Page deleted successfully',
        data: deletedPage
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error: any) {
    console.error('API Error:', error);
    const dbError = handleDatabaseError(error);
    
    return res.status(dbError.status).json({
      success: false,
      error: dbError.error,
      details: error.message
    });
  }
}