import { pgTable, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const urlsTable = pgTable("urls", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  longUrl: varchar("long_url", { length: 2048 }).notNull(),
  shortUrl: varchar("short_url", { length: 255 }).notNull(),
  shortId: varchar("short_id", { length: 255 }).notNull().unique(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});