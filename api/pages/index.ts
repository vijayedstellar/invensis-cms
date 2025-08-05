import { VercelRequest, VercelResponse } from '@vercel/node';
import { db, initializeDatabase, handleDatabaseError } from '../lib/db';
import { pages } from '../lib/schema';
import { eq, desc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Initialize database on first request
    await initializeDatabase();

    if (req.method === 'GET') {
      // Fetch all pages
      const allPages = await db
        .select()
        .from(pages)
        .orderBy(desc(pages.createdAt));

      return res.status(200).json({
        success: true,
        data: allPages,
        count: allPages.length
      });
    }

    if (req.method === 'POST') {
      // Create new page
      const { title, slug, description, h1, content, status, author } = req.body;

      if (!title || !slug) {
        return res.status(400).json({
          success: false,
          error: 'Title and slug are required'
        });
      }

      const newPage = {
        title,
        slug,
        description: description || '',
        h1: h1 || '',
        content: content || '',
        status: status || 'draft',
        author: author || 'Unknown',
        url: `/${slug}`,
        views: 0
      };

      const [createdPage] = await db
        .insert(pages)
        .values(newPage)
        .returning();

      return res.status(201).json({
        success: true,
        data: createdPage
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