import { pgTable, uuid, text, timestamp, integer, boolean, jsonb, date } from "drizzle-orm/pg-core";

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  h1: text("h1"),
  content: text("content"),
  status: text("status").default("draft"),
  author: text("author"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  views: integer("views").default(0),
  url: text("url"),
});

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const generatedPages = pgTable("generated_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  template: text("template"),
  status: text("status").default("published"),
  publishedDate: date("published_date"),
  lastModified: timestamp("last_modified").defaultNow(),
  views: integer("views").default(0),
  countries: text("countries").array(),
  cities: text("cities").array(),
  author: text("author"),
  category: text("category"),
  generatedFrom: text("generated_from"),
});

export const userSessions = pgTable("user_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  username: text("username").notNull(),
  isAuthenticated: boolean("is_authenticated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;