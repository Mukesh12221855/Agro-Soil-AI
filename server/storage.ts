import { users, soilReports, marketPrices, type User, type InsertUser, type SoilReport, type InsertSoilReport, type MarketPrice } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createSoilReport(report: InsertSoilReport): Promise<SoilReport>;
  getSoilReports(userId: number): Promise<SoilReport[]>;

  getMarketPrices(): Promise<MarketPrice[]>;
  seedMarketPrices(): Promise<void>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createSoilReport(report: InsertSoilReport): Promise<SoilReport> {
    const [newReport] = await db.insert(soilReports).values(report).returning();
    return newReport;
  }

  async getSoilReports(userId: number): Promise<SoilReport[]> {
    return db
      .select()
      .from(soilReports)
      .where(eq(soilReports.userId, userId))
      .orderBy(desc(soilReports.createdAt));
  }

  async getMarketPrices(): Promise<MarketPrice[]> {
    return db.select().from(marketPrices).orderBy(desc(marketPrices.date));
  }

  async seedMarketPrices(): Promise<void> {
    const count = await db.select({ count: marketPrices.id }).from(marketPrices);
    if (count.length === 0) {
      await db.insert(marketPrices).values([
        { cropName: "Wheat", state: "Punjab", price: "2200", district: "Ludhiana" },
        { cropName: "Rice", state: "Punjab", price: "3000", district: "Amritsar" },
        { cropName: "Cotton", state: "Gujarat", price: "6000", district: "Rajkot" },
        { cropName: "Sugarcane", state: "Uttar Pradesh", price: "350", district: "Meerut" },
        { cropName: "Maize", state: "Karnataka", price: "1800", district: "Davangere" },
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
