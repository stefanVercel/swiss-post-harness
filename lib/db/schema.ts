import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

/**
 * Starter schema. Add your own tables here as the app grows.
 * `items` is a minimal example table so the Drizzle client is usable
 * right away — rename or replace it whenever you're ready.
 */
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Item = typeof items.$inferSelect
export type NewItem = typeof items.$inferInsert
