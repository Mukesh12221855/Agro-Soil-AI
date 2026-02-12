import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  location: text("location"), // e.g., "Punjab, India"
  role: text("role").default("farmer"), // farmer, expert
  createdAt: timestamp("created_at").defaultNow(),
});

export const soilReports = pgTable("soil_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  nitrogen: decimal("nitrogen"),
  phosphorus: decimal("phosphorus"),
  potassium: decimal("potassium"),
  ph: decimal("ph"),
  rainfall: decimal("rainfall"),
  temperature: decimal("temperature"),
  cropRecommendation: text("crop_recommendation"),
  fertilizerRecommendation: text("fertilizer_recommendation"),
  imageUrl: text("image_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketPrices = pgTable("market_prices", {
  id: serial("id").primaryKey(),
  cropName: text("crop_name").notNull(),
  state: text("state").notNull(),
  district: text("district"),
  price: decimal("price").notNull(), // Per quintal
  date: timestamp("date").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertSoilReportSchema = createInsertSchema(soilReports).omit({ id: true, createdAt: true });
export const insertMarketPriceSchema = createInsertSchema(marketPrices).omit({ id: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SoilReport = typeof soilReports.$inferSelect;
export type InsertSoilReport = z.infer<typeof insertSoilReportSchema>;
export type MarketPrice = typeof marketPrices.$inferSelect;

export * from "./models/chat";
