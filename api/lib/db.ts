import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pages, siteSettings, generatedPages, userSessions } from './schema';

// Database connection with connection pooling
const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL or VITE_DATABASE_URL environment variable is required');
}

// Create postgres client with connection pooling
const client = postgres(connectionString, {
  max: 1, // Limit connections for serverless
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(client);

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await client`
      CREATE TABLE IF NOT EXISTS pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        h1 TEXT,
        content TEXT,
        status VARCHAR(20) DEFAULT 'draft',
        author TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        views INTEGER DEFAULT 0,
        url TEXT
      );
    `;

    await client`
      CREATE TABLE IF NOT EXISTS site_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key TEXT UNIQUE NOT NULL,
        value JSONB,
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    await client`
      CREATE TABLE IF NOT EXISTS generated_pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        template TEXT,
        status VARCHAR(20) DEFAULT 'published',
        published_date DATE,
        last_modified TIMESTAMPTZ DEFAULT now(),
        views INTEGER DEFAULT 0,
        countries TEXT[],
        cities TEXT[],
        author TEXT,
        category TEXT,
        generated_from TEXT
      );
    `;

    await client`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        username TEXT NOT NULL,
        is_authenticated BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now(),
        expires_at TIMESTAMPTZ
      );
    `;

    // Create indexes for better performance
    await client`CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);`;
    await client`CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);`;
    await client`CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);`;
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper function to handle database errors
export function handleDatabaseError(error: any) {
  console.error('Database error:', error);
  
  if (error.code === '23505') {
    return { error: 'Duplicate entry', status: 409 };
  }
  
  if (error.code === '23503') {
    return { error: 'Referenced record not found', status: 404 };
  }
  
  return { error: 'Database operation failed', status: 500 };
}