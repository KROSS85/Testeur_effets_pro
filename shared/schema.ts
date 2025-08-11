import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const effects = pgTable("effects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  filename: text("filename").notNull(),
  code: text("code").notNull(),
  parameters: jsonb("parameters").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const performanceSessions = pgTable("performance_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  effectId: varchar("effect_id").references(() => effects.id),
  sessionData: jsonb("session_data").notNull(),
  avgFps: integer("avg_fps"),
  avgMemory: integer("avg_memory"),
  avgCpu: integer("avg_cpu"),
  duration: integer("duration"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEffectSchema = createInsertSchema(effects).pick({
  name: true,
  filename: true,
  code: true,
  parameters: true,
});

export const insertPerformanceSessionSchema = createInsertSchema(performanceSessions).pick({
  effectId: true,
  sessionData: true,
  avgFps: true,
  avgMemory: true,
  avgCpu: true,
  duration: true,
});

export type InsertEffect = z.infer<typeof insertEffectSchema>;
export type Effect = typeof effects.$inferSelect;
export type InsertPerformanceSession = z.infer<typeof insertPerformanceSessionSchema>;
export type PerformanceSession = typeof performanceSessions.$inferSelect;
