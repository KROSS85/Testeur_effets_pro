import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertEffectSchema, insertPerformanceSessionSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      if (file.mimetype === 'application/javascript' || file.originalname.endsWith('.js')) {
        cb(null, true);
      } else {
        cb(new Error('Only JavaScript files are allowed'));
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });

  // Get all effects
  app.get("/api/effects", async (req, res) => {
    try {
      const effects = await storage.getAllEffects();
      res.json(effects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch effects" });
    }
  });

  // Get single effect
  app.get("/api/effects/:id", async (req, res) => {
    try {
      const effect = await storage.getEffect(req.params.id);
      if (!effect) {
        return res.status(404).json({ message: "Effect not found" });
      }
      res.json(effect);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch effect" });
    }
  });

  // Upload new effect
  app.post("/api/effects", upload.single("effectFile"), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const code = req.file.buffer.toString('utf-8');
      const filename = req.file.originalname;
      const name = filename.replace('.js', '').replace(/[-_]/g, ' ');

      // Basic validation for effect structure
      if (!code.includes('class') || !code.includes('render')) {
        return res.status(400).json({ 
          message: "Invalid effect file: must contain a class with render method" 
        });
      }

      const effectData = {
        name,
        filename,
        code,
        parameters: {} // Will be extracted from the code if possible
      };

      const validatedData = insertEffectSchema.parse(effectData);
      const effect = await storage.createEffect(validatedData);
      
      res.status(201).json(effect);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid effect data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create effect" });
    }
  });

  // Delete effect
  app.delete("/api/effects/:id", async (req, res) => {
    try {
      const effect = await storage.getEffect(req.params.id);
      if (!effect) {
        return res.status(404).json({ message: "Effect not found" });
      }
      
      await storage.deleteEffect(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete effect" });
    }
  });

  // Create performance session
  app.post("/api/performance-sessions", async (req, res) => {
    try {
      const validatedData = insertPerformanceSessionSchema.parse(req.body);
      const session = await storage.createPerformanceSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create performance session" });
    }
  });

  // Get performance sessions for an effect
  app.get("/api/effects/:id/performance-sessions", async (req, res) => {
    try {
      const sessions = await storage.getPerformanceSessionsByEffect(req.params.id);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch performance sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
