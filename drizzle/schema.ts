import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Model Profile table
export const modelProfile = mysqlTable("modelProfile", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: int("age").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  bio: text("bio"),
  profilePhoto: text("profilePhoto"), // URL de la foto
  coverPhoto: text("coverPhoto"), // URL de la portada
  subscriptionPrice: int("subscriptionPrice").default(8000).notNull(),
  subscribers: int("subscribers").default(8352).notNull(),
  whatsappNumber: varchar("whatsappNumber", { length: 20 }).notNull(),
  breKey: varchar("breKey", { length: 255 }).notNull(),
  isLive: boolean("isLive").default(false).notNull(),
  lastLiveTime: varchar("lastLiveTime", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ModelProfile = typeof modelProfile.$inferSelect;
export type InsertModelProfile = typeof modelProfile.$inferInsert;

// Gallery items table
export const galleryItems = mysqlTable("galleryItems", {
  id: varchar("id", { length: 64 }).primaryKey(),
  uri: text("uri").notNull(), // URL de la imagen/video
  type: mysqlEnum("type", ["photo", "video"]).notNull(),
  isPrivate: boolean("isPrivate").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = typeof galleryItems.$inferInsert;

// Subscribers table
export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  deviceId: varchar("deviceId", { length: 255 }).notNull().unique(), // ID único del dispositivo
  isSubscribed: boolean("isSubscribed").default(false).notNull(),
  subscriptionDate: timestamp("subscriptionDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;
