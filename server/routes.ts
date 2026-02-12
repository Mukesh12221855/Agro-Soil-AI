import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./replit_integrations/chat";

// Mock ML Prediction logic (replace with real Python/Flask call or OpenAI if needed)
function predictCrop(data: any) {
  const { nitrogen, phosphorus, potassium, rainfall, temperature } = data;
  
  // Very basic heuristic for demo purposes
  if (nitrogen > 100 && rainfall > 1000) return "Rice";
  if (temperature < 20 && rainfall < 500) return "Wheat";
  if (potassium > 50 && temperature > 25) return "Cotton";
  if (phosphorus > 40) return "Maize";
  return "Barley";
}

function recommendFertilizer(crop: string) {
  const fertilizers: Record<string, string> = {
    "Rice": "Urea (46-0-0)",
    "Wheat": "DAP (18-46-0)",
    "Cotton": "Potash (0-0-60)",
    "Maize": "NPK (20-20-20)",
    "Barley": "Ammonium Nitrate"
  };
  return fertilizers[crop] || "General NPK";
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);
  registerChatRoutes(app);

  // === Soil & Prediction Routes ===
  app.post(api.soil.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const input = api.soil.create.input.parse(req.body);
      const report = await storage.createSoilReport({
        ...input,
        userId: req.user.id,
      });
      res.status(201).json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.soil.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const reports = await storage.getSoilReports(req.user.id);
    res.json(reports);
  });

  app.post(api.soil.predict.path, async (req, res) => {
    // This is a stateless prediction endpoint, but we can also use it during report creation
    const input = api.soil.predict.input.parse(req.body);
    
    const recommendedCrop = predictCrop(input);
    const fertilizer = recommendFertilizer(recommendedCrop);
    
    res.json({
      recommendedCrop,
      confidence: 0.85, // Mock confidence
      fertilizer
    });
  });

  // === Market Prices Routes ===
  app.get(api.market.list.path, async (req, res) => {
    const prices = await storage.getMarketPrices();
    res.json(prices);
  });

  // === Weather Proxy (Mock for now, or use OpenWeatherMap if key provided) ===
  app.get(api.weather.get.path, async (req, res) => {
    // Mock weather data
    const location = req.query.location as string || "Unknown";
    
    // In a real app, fetch from OpenWeatherMap here using process.env.OPENWEATHER_API_KEY
    const mockWeather = {
      temp: 24,
      humidity: 65,
      description: "Partly Cloudy",
      forecast: [
        { date: "2023-10-25", temp: 24, condition: "Sunny" },
        { date: "2023-10-26", temp: 23, condition: "Cloudy" },
        { date: "2023-10-27", temp: 22, condition: "Rain" },
        { date: "2023-10-28", temp: 25, condition: "Sunny" },
        { date: "2023-10-29", temp: 26, condition: "Sunny" },
        { date: "2023-10-30", temp: 24, condition: "Cloudy" },
        { date: "2023-10-31", temp: 23, condition: "Cloudy" },
      ]
    };
    
    res.json(mockWeather);
  });

  // Seed data on startup
  await storage.seedMarketPrices();

  return httpServer;
}
