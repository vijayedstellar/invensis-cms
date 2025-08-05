import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pages, siteSettings, generatedPages, userSessions } from './schema';

// Database connection with connection pooling optimized for serverless
let client: postgres.Sql | null = null;
let db: ReturnType<typeof drizzle> | null = null;

export function getDatabase() {
  try {
    // Use DATABASE_URL for serverless functions, fallback to VITE_DATABASE_URL
    const connectionString = process.env.DATABASE_URL || process.env.VITE_DATABASE_URL;
    
    console.log('Database connection attempt:', {
      hasConnectionString: !!connectionString,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    });

    if (!connectionString) {
      throw new Error('No database connection string found. Please set DATABASE_URL or VITE_DATABASE_URL environment variable.');
    }

    // Reuse existing connection if available
    if (client && db) {
      console.log('Reusing existing database connection');
      return { client, db, isConnected: true };
    }

    // Create new connection with serverless-optimized settings
    client = postgres(connectionString, {
      max: 1, // Limit connections for serverless
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false, // Disable prepared statements for better compatibility
    });

    db = drizzle(client);
    
    console.log('New database connection created successfully');
    return { client, db, isConnected: true };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { client: null, db: null, isConnected: false, error: error instanceof Error ? error.message : 'Unknown database error' };
  }
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    const { client, isConnected } = getDatabase();
    
    if (!isConnected || !client) {
      throw new Error('Database connection not available');
    }

    console.log('Initializing database tables...');

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
    
    console.log('Database tables initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('Database initialization error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown initialization error' 
    };
  }
}

// Helper function to handle database errors
export function handleDatabaseError(error: any) {
  console.error('Database operation error:', error);
  
  if (error.code === '23505') {
    return { error: 'Duplicate entry - this slug already exists', status: 409 };
  }
  
  if (error.code === '23503') {
    return { error: 'Referenced record not found', status: 404 };
  }

  if (error.code === 'ECONNREFUSED') {
    return { error: 'Database connection refused', status: 503 };
  }

  if (error.code === 'ENOTFOUND') {
    return { error: 'Database host not found', status: 503 };
  }
  
  return { 
    error: error.message || 'Database operation failed', 
    status: 500 
  };
}

// Test database connection
export async function testConnection() {
  try {
    const { client, isConnected, error } = getDatabase();
    
    if (!isConnected || !client) {
      return { 
        success: false, 
        error: error || 'Failed to establish database connection' 
      };
    }

    // Test with a simple query
    await client`SELECT 1 as test`;
    
    console.log('Database connection test successful');
    return { success: true, message: 'Database connection successful' };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection test failed' 
    };
  }
}