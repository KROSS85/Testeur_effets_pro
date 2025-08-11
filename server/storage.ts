import { type Effect, type InsertEffect, type PerformanceSession, type InsertPerformanceSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Effects
  getAllEffects(): Promise<Effect[]>;
  getEffect(id: string): Promise<Effect | undefined>;
  createEffect(effect: InsertEffect): Promise<Effect>;
  deleteEffect(id: string): Promise<void>;
  
  // Performance Sessions
  createPerformanceSession(session: InsertPerformanceSession): Promise<PerformanceSession>;
  getPerformanceSessionsByEffect(effectId: string): Promise<PerformanceSession[]>;
}

export class MemStorage implements IStorage {
  private effects: Map<string, Effect>;
  private performanceSessions: Map<string, PerformanceSession>;

  constructor() {
    this.effects = new Map();
    this.performanceSessions = new Map();
    
    // Initialize with default OrganicLifeRespirationPro effect
    this.initializeDefaultEffects();
  }

  private initializeDefaultEffects() {
    const defaultEffect: Effect = {
      id: 'organic-life-respiration-pro',
      name: 'Organic Life Respiration Pro',
      filename: 'organic-life-respiration-pro.js',
      code: '', // Will be loaded from the client
      parameters: {
        vitesse: { type: 'range', min: 0.1, max: 3, default: 1 },
        intensite: { type: 'range', min: 0, max: 1, default: 0.8 },
        amplitude: { type: 'range', min: 0.05, max: 0.5, default: 0.25 },
        circulation: { type: 'range', min: 0, max: 1, default: 0.9 },
        haloIntensity: { type: 'range', min: 0, max: 1, default: 0.7 }
      },
      createdAt: new Date()
    };
    
    this.effects.set(defaultEffect.id, defaultEffect);
  }

  async getAllEffects(): Promise<Effect[]> {
    return Array.from(this.effects.values());
  }

  async getEffect(id: string): Promise<Effect | undefined> {
    return this.effects.get(id);
  }

  async createEffect(insertEffect: InsertEffect): Promise<Effect> {
    const id = randomUUID();
    const effect: Effect = { 
      ...insertEffect, 
      id,
      parameters: insertEffect.parameters || {},
      createdAt: new Date()
    };
    this.effects.set(id, effect);
    return effect;
  }

  async deleteEffect(id: string): Promise<void> {
    this.effects.delete(id);
    // Also delete associated performance sessions
    Array.from(this.performanceSessions.entries()).forEach(([sessionId, session]) => {
      if (session.effectId === id) {
        this.performanceSessions.delete(sessionId);
      }
    });
  }

  async createPerformanceSession(insertSession: InsertPerformanceSession): Promise<PerformanceSession> {
    const id = randomUUID();
    const session: PerformanceSession = {
      ...insertSession,
      id,
      duration: insertSession.duration || 0,
      avgFps: insertSession.avgFps || 0,
      avgMemory: insertSession.avgMemory || 0,
      avgCpu: insertSession.avgCpu || 0,
      createdAt: new Date()
    };
    this.performanceSessions.set(id, session);
    return session;
  }

  async getPerformanceSessionsByEffect(effectId: string): Promise<PerformanceSession[]> {
    return Array.from(this.performanceSessions.values()).filter(
      session => session.effectId === effectId
    );
  }
}

export const storage = new MemStorage();
