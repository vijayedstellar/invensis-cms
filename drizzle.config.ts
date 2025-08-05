import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.VITE_DATABASE_URL || 'postgresql://neondb_owner:npg_AS3XRTBjef5Q@ep-patient-hat-a1hwrjlk-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  },
  verbose: true,
  strict: true,
});