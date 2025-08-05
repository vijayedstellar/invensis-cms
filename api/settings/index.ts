import { VercelRequest, VercelResponse } from '@vercel/node';
import { db, initializeDatabase, handleDatabaseError } from '../lib/db';
import { siteSettings } from '../lib/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await initializeDatabase();

    if (req.method === 'GET') {
      // Fetch all settings
      const allSettings = await db
        .select()
        .from(siteSettings);

      // Convert to key-value object
      const settingsObject: any = {};
      allSettings.forEach(setting => {
        settingsObject[setting.key] = setting.value;
      });

      return res.status(200).json({
        success: true,
        data: settingsObject
      });
    }

    if (req.method === 'PUT') {
      // Update settings
      const { domainSettings, siteSettings: siteSettingsData } = req.body;

      const updates = [];

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

      const results = [];

      for (const update of updates) {
        // Try to update existing setting
        const [existingSetting] = await db
          .select()
          .from(siteSettings)
          .where(eq(siteSettings.key, update.key));

        if (existingSetting) {
          // Update existing
          const [updatedSetting] = await db
            .update(siteSettings)
            .set({
              value: update.value,
              updatedAt: new Date()
            })
            .where(eq(siteSettings.key, update.key))
            .returning();
          
          results.push(updatedSetting);
        } else {
          // Create new
          const [newSetting] = await db
            .insert(siteSettings)
            .values({
              key: update.key,
              value: update.value
            })
            .returning();
          
          results.push(newSetting);
        }
      }

      return res.status(200).json({
        success: true,
        data: results,
        message: 'Settings updated successfully'
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