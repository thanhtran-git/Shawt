import { pgTable, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const urls = pgTable("urls", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  shortUrl: varchar("short_url", { length: 255 }).notNull(),
  longUrl: varchar("long_url", { length: 2048 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});