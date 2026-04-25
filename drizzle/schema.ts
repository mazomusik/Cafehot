import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// Cambiamos a nombres de tabla en minúsculas para evitar errores en Railway/Linux
export const modelProfile = mysqlTable("model_profile", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  age: int("age").notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  bio: text("bio"),
  profilePhoto: text("profilePhoto"),
  coverPhoto: text("coverPhoto"),
  subscriptionPrice: int("subscriptionPrice").default(8000).notNull(),
  subscribers: int("subscribers").default(8352).notNull(),
  whatsappNumber: varchar("whatsappNumber", { length: 20 }).notNull(),
  breKey: varchar("breKey", { length: 255 }).notNull(),
  isLive: boolean("isLive").default(false).notNull(),
  lastLiveTime: varchar("lastLiveTime", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const galleryItems = mysqlTable("gallery_items", {
  id: varchar("id", { length: 64 }).primaryKey(),
  uri: text("uri").notNull(),
  type: mysqlEnum("type", ["photo", "video"]).notNull(),
  isPrivate: boolean("isPrivate").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  deviceId: varchar("deviceId", { length: 255 }).notNull().unique(),
  isSubscribed: boolean("isSubscribed").default(false).notNull(),
  subscriptionDate: timestamp("subscriptionDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
