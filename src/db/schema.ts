import { pgTable, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const urlsTable = pgTable("urls", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  longUrl: varchar("long_url", { length: 2048 }).notNull(),
  shortUrl: varchar("short_url", { length: 255 }).notNull(),  
  createdAt: timestamp("created_at").defaultNow(),
});