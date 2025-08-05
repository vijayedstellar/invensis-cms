import { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase, initializeDatabase, handleDatabaseError, testConnection } from '../lib/db';
import { siteSettings } from '../lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  try {
    console.log('Settings API Request:', {
      method: req.method,
      body: req.method === 'PUT' ? req.body : 'N/A'
    });

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
      console.log('Fetching all settings...');
      
      try {
        const allSettings = await db
          .select()
          .from(siteSettings);

        // Convert to key-value object
        const settingsObject: any = {};
        allSettings.forEach(setting => {
          settingsObject[setting.key] = setting.value;
        });

        console.log(`Successfully fetched ${allSettings.length} settings`);

        return res.status(200).json({
          success: true,
          data: settingsObject,
          count: allSettings.length,
          message: 'Settings fetched successfully'
        });
      } catch (dbError) {
        console.error('Database query error:', dbError);
        const errorResponse = handleDatabaseError(dbError);
        
        return res.status(errorResponse.status).json({
          success: false,
          error: errorResponse.error,
          details: dbError instanceof Error ? dbError.message : 'Unknown error',
          fallback: 'Please use localStorage fallback'
        });
      }
    }

    if (req.method === 'PUT') {
      console.log('Updating settings...');
      
      try {
        const { domainSettings, siteSettings: siteSettingsData } = req.body;

        if (!domainSettings && !siteSettingsData) {
          return res.status(400).json({
            success: false,
            error: 'No settings data provided',
            details: 'Either domainSettings or siteSettings must be provided'
          });
        }

        const updates = [];
        const results = [];

        if (domainSettings) {
          updates.push({
            key: 'domainSettings',
            value: domainSettings
          });
        }

        if (siteSettingsData) {
          updates.push({
            key: 'siteSettings',
            value: siteSettingsData
          });
        }

        console.log(`Processing ${updates.length} setting updates`);

        for (const update of updates) {
          try {
            // Try to find existing setting
            const [existingSetting] = await db
              .select()
              .from(siteSettings)
              .where(eq(siteSettings.key, update.key));

            if (existingSetting) {
              // Update existing setting
              const [updatedSetting] = await db
                .update(siteSettings)
                .set({
                  value: update.value,
                  updatedAt: new Date()
                })
                .where(eq(siteSettings.key, update.key))
                .returning();
              
              results.push(updatedSetting);
              console.log(`Updated setting: ${update.key}`);
            } else {
              // Create new setting
              const [newSetting] = await db
                .insert(siteSettings)
                .values({
                  key: update.key,
                  value: update.value
                })
                .returning();
              
              results.push(newSetting);
              console.log(`Created new setting: ${update.key}`);
            }
          } catch (settingError) {
            console.error(`Error updating setting ${update.key}:`, settingError);
            throw settingError;
          }
        }

        console.log(`Successfully processed ${results.length} setting updates`);

        return res.status(200).json({
          success: true,
          data: results,
          count: results.length,
          message: 'Settings updated successfully'
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

    // Method not allowed
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} not allowed`,
      allowedMethods: ['GET', 'PUT', 'OPTIONS']
    });

  } catch (error: any) {
    console.error('Unhandled settings API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message || 'Unknown error occurred',
      fallback: 'Please use localStorage fallback'
    });
  }
}