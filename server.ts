/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { AssessmentInputSchema } from './src/schemas/assessmentSchema';
import { groqService } from './src/server/groqService';
import { CAREER_COMPARISON_DATA } from './src/data/careerComparisonData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Security and size limits
app.use(express.json({ limit: '1mb' }));

// Simple in-memory rate limiting map (IP -> timestamps)
const rateLimitWindowMs = 60 * 1000; // 1 minute
const maxRequestsPerWindow = 30;
const ipRequests = new Map<string, number[]>();

function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const timestamps = (ipRequests.get(ip) || []).filter((time) => now - time < rateLimitWindowMs);

  if (timestamps.length >= maxRequestsPerWindow) {
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please slow down and try again in a minute.',
    });
    return;
  }

  timestamps.push(now);
  ipRequests.set(ip, timestamps);
  next();
}

app.use('/api', rateLimiter);

// Health & configuration check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    hasGroqKey: groqService.hasApiKey(),
    model: groqService.getModelName(),
    timestamp: new Date().toISOString(),
  });
});

// Career comparison data endpoint
app.get('/api/careers/compare', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: CAREER_COMPARISON_DATA,
  });
});

// Roadmap generation endpoint
app.post('/api/roadmap/generate', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const parseResult = AssessmentInputSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed. Please verify your assessment answers.',
        details: parseResult.error.format(),
      });
      return;
    }

    const validatedAssessment = parseResult.data;
    console.log(`Generating roadmap for goal: "${validatedAssessment.desiredCareer}"...`);

    const result = await groqService.generateRoadmap(validatedAssessment);
    const durationMs = Date.now() - startTime;
    console.log(`Roadmap generated in ${durationMs}ms (source: ${result.source})`);

    res.json({
      success: true,
      data: result.roadmap,
      source: result.source,
      errorNotice: result.errorNotice,
      durationMs,
    });
  } catch (err: any) {
    console.error('Roadmap generation handler exception:', err);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while generating your career roadmap. Please try again.',
    });
  }
});

// Mount Vite middleware in development or static dist in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerPath AI Server running on http://0.0.0.0:${PORT} (ENV: ${isProduction ? 'production' : 'development'})`);
    console.log(`Groq API integration: ${groqService.hasApiKey() ? 'API Key Detected' : 'Adaptive Engine Fallback (Add GROQ_API_KEY in .env)'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
