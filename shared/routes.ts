import { z } from 'zod';
import { insertUserSchema, insertSoilReportSchema, soilReports, marketPrices } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof insertUserSchema>(), // Returns the user object (sanitized)
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom<typeof insertUserSchema>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.custom<typeof insertUserSchema>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  weather: {
    get: {
      method: 'GET' as const,
      path: '/api/weather' as const,
      input: z.object({ location: z.string() }),
      responses: {
        200: z.object({
          temp: z.number(),
          humidity: z.number(),
          description: z.string(),
          forecast: z.array(z.object({
            date: z.string(),
            temp: z.number(),
            condition: z.string(),
          })),
        }),
      },
    },
  },
  soil: {
    create: {
      method: 'POST' as const,
      path: '/api/soil-reports' as const,
      input: insertSoilReportSchema,
      responses: {
        201: z.custom<typeof soilReports.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/soil-reports' as const,
      responses: {
        200: z.array(z.custom<typeof soilReports.$inferSelect>()),
      },
    },
    predict: {
      method: 'POST' as const,
      path: '/api/predict-crop' as const,
      input: z.object({
        nitrogen: z.number(),
        phosphorus: z.number(),
        potassium: z.number(),
        ph: z.number(),
        rainfall: z.number(),
        temperature: z.number(),
      }),
      responses: {
        200: z.object({
          recommendedCrop: z.string(),
          confidence: z.number(),
          fertilizer: z.string(),
        }),
      },
    },
  },
  market: {
    list: {
      method: 'GET' as const,
      path: '/api/market-prices' as const,
      responses: {
        200: z.array(z.custom<typeof marketPrices.$inferSelect>()),
      },
    },
  },
};
