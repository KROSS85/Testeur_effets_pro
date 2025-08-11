import { BaseEffect } from "./base-effect";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
  color: { r: number; g: number; b: number };
  pulsePhase: number;
  connected: boolean;
}

interface ThermalWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  intensity: number;
  life: number;
  currentIntensity: number;
}

interface VolumetricRay {
  angle: number;
  length: number;
  maxLength: number;
  width: number;
  speed: number;
  opacity: number;
  pulsePhase: number;
  currentOpacity: number;
}

interface HaloLayer {
  radius: number;
  maxRadius: number;
  opacity: number;
  pulseSpeed: number;
  parallaxFactor: number;
  color: { r: number; g: number; b: number };
  pulsePhase: number;
  currentRadius: number;
  currentOpacity: number;
}

export class OrganicLifeRespirationPro extends BaseEffect {
  private time = 0;
  private phaseRespiration = 'inspiration';
  private cycleRespiration = 0;
  private dureeInspiration = 4000;
  private dureeExpiration = 6000;
  private profondeurRespiration = 1;
  private frequenceCardiaque = 72;
  private isPlaying = true;
  
  private particles: Particle[] = [];
  private thermalWaves: ThermalWave[] = [];
  private volumetricRays: VolumetricRay[] = [];
  private haloLayers: HaloLayer[] = [];
  private maxParticles = 150;
  
  private teintes = {
    cosmic: { 
      base: { r: 120, g: 80, b: 220 }, 
      pulse: { r: 180, g: 120, b: 255 },
      highlight: { r: 220, g: 180, b: 255 }
    },
    bio: { 
      base: { r: 220, g: 100, b: 100 }, 
      pulse: { r: 255, g: 160, b: 160 },
      highlight: { r: 255, g: 220, b: 180 }
    },
    neon: { 
      base: { r: 255, g: 50, b: 150 }, 
      pulse: { r: 255, g: 150, b: 50 },
      highlight: { r: 100, g: 255, b: 220 }
    }
  };

  constructor() {
    super({
      id: 'organic-life-respiration-pro',
      name: 'Organic Life Respiration Pro',
      category: 'biological',
      version: '2.0',
      performance: 'medium',
      parameters: {
        vitesse: { type: 'range', min: 0.1, max: 3, default: 1 },
        intensite: { type: 'range', min: 0, max: 1, default: 0.8 },
        amplitude: { type: 'range', min: 0.05, max: 0.5, default: 0.25 },
        rythme: { type: 'range', min: 0.5, max: 2, default: 1 },
        circulation: { type: 'range', min: 0, max: 1, default: 0.9 },
        stress: { type: 'range', min: 0, max: 1, default: 0.2 },
        haloIntensity: { type: 'range', min: 0, max: 1, default: 0.7 },
        particleDensity: { type: 'range', min: 0, max: 1, default: 0.6 },
        thermalDistortion: { type: 'range', min: 0, max: 1, default: 0.4 },
        volumetricLight: { type: 'range', min: 0, max: 1, default: 0.5 },
        colorTheme: { type: 'select', options: ['cosmic', 'bio', 'neon'], default: 'bio' }
      }
    });
  }

  initialize(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.initParticles();
    this.initThermalWaves();
    this.initVolumetricRays();
    this.initHaloLayers();
  }

  private initParticles(): void {
    if (!this.canvas) return;
    
    this.particles = [];
    const density = this.maxParticles * this.getParameter('particleDensity');
    
    for (let i = 0; i < density; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: 1 + Math.random() * 3,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        life: Math.random(),
        maxLife: 0.5 + Math.random() * 1.5,
        color: this.getThemeColor('base'),
        pulsePhase: Math.random() * Math.PI * 2,
        connected: Math.random() > 0.7
      });
    }
  }

  private initThermalWaves(): void {
    if (!this.canvas) return;
    
    this.thermalWaves = [];
    const count = 5 + Math.floor(this.getParameter('thermalDistortion') * 10);
    
    for (let i = 0; i < count; i++) {
      this.thermalWaves.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: 10 + Math.random() * 50,
        maxRadius: 100 + Math.random() * 200,
        speed: 0.2 + Math.random() * 0.8,
        intensity: 0.3 + Math.random() * 0.7,
        life: 0,
        currentIntensity: 0
      });
    }
  }

  private initVolumetricRays(): void {
    this.volumetricRays = [];
    const count = 3 + Math.floor(this.getParameter('volumetricLight') * 7);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      this.volumetricRays.push({
        angle: angle,
        length: 0,
        maxLength: 100 + Math.random() * 200,
        width: 2 + Math.random() * 8,
        speed: 0.01 + Math.random() * 0.03,
        opacity: 0.1 + Math.random() * 0.3,
        pulsePhase: Math.random() * Math.PI * 2,
        currentOpacity: 0
      });
    }
  }

  private initHaloLayers(): void {
    this.haloLayers = [];
    const count = 3 + Math.floor(this.getParameter('haloIntensity') * 5);
    
    for (let i = 0; i < count; i++) {
      this.haloLayers.push({
        radius: 50 + i * 40,
        maxRadius: 200 + i * 60,
        opacity: 0.2 - i * 0.05,
        pulseSpeed: 0.01 + i * 0.005,
        parallaxFactor: 0.2 + i * 0.1,
        color: this.getThemeColor(i === 0 ? 'pulse' : 'base'),
        pulsePhase: 0,
        currentRadius: 0,
        currentOpacity: 0
      });
    }
  }

  private getThemeColor(type: 'base' | 'pulse' | 'highlight'): { r: number; g: number; b: number } {
    const theme = this.teintes[this.getParameter('colorTheme') as keyof typeof this.teintes];
    return theme[type] || theme.base;
  }

  render(ctx: CanvasRenderingContext2D, deltaTime: number): void {
    if (!this.canvas) return;

    if (this.isPlaying) {
      this.time += deltaTime * this.getParameter('vitesse');
    }
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Update breathing cycle
    this.updateCycleRespiration(deltaTime);
    if (this.isPlaying) {
      this.updateParticles(deltaTime);
      this.updateThermalWaves(deltaTime);
      this.updateVolumetricRays(deltaTime);
      this.updateHaloLayers(deltaTime);
    }
    
    // Render background effects first
    this.renderThermalDistortion(ctx, centerX, centerY);
    this.renderVolumetricLight(ctx, centerX, centerY);
    
    // Render core breathing visualization (always visible)
    this.renderBreathingCore(ctx, centerX, centerY);
    
    // Render foreground layers
    this.renderHaloLayers(ctx, centerX, centerY);
    this.renderCirculationSanguine(ctx, centerX, centerY);
    this.renderParticles(ctx);
  }

  private renderBreathingCore(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
    const breathPhase = Math.sin(this.time * 0.001) * 0.5 + 0.5;
    const amplitude = this.getParameter('amplitude');
    const baseRadius = 80 + breathPhase * 60 * amplitude;
    const themeColor = this.getThemeColor('base');
    const pulseColor = this.getThemeColor('pulse');
    
    // Outer breathing aura
    const outerGradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, baseRadius * 3
    );
    
    outerGradient.addColorStop(0, `rgba(${pulseColor.r}, ${pulseColor.g}, ${pulseColor.b}, 0.6)`);
    outerGradient.addColorStop(0.3, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.4)`);
    outerGradient.addColorStop(0.7, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.2)`);
    outerGradient.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0)`);
    
    ctx.fillStyle = outerGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Main breathing circle
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, baseRadius * 2
    );
    
    gradient.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.9)`);
    gradient.addColorStop(0.5, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.6)`);
    gradient.addColorStop(0.8, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0.3)`);
    gradient.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner core with pulse
    const pulseIntensity = Math.sin(this.time * 0.003) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(${pulseColor.r}, ${pulseColor.g}, ${pulseColor.b}, ${0.8 * pulseIntensity})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Central bright core
    ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * pulseIntensity})`;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  start(): void {
    this.isPlaying = true;
  }

  pause(): void {
    this.isPlaying = false;
  }

  renderStatic(ctx: CanvasRenderingContext2D): void {
    if (!this.canvas) return;
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Render static version
    this.renderHaloLayers(ctx, centerX, centerY);
    this.renderCirculationSanguine(ctx, centerX, centerY);
    this.renderParticles(ctx);
  }

  private updateCycleRespiration(deltaTime: number): void {
    const breathCycle = Math.sin(this.time * 0.001) * 0.5 + 0.5;
    this.profondeurRespiration = breathCycle * this.getParameter('amplitude') + (1 - this.getParameter('amplitude'));
  }

  private updateParticles(deltaTime: number): void {
    if (!this.canvas) return;
    
    const breathFactor = this.profondeurRespiration * 0.5 + 0.5;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.particles.forEach(particle => {
      particle.life += deltaTime * 0.001;
      if (particle.life > particle.maxLife) {
        particle.life = 0;
        particle.x = centerX + (Math.random() - 0.5) * 100;
        particle.y = centerY + (Math.random() - 0.5) * 100;
      }
      
      const angle = Math.atan2(particle.y - centerY, particle.x - centerX);
      const breathEffect = Math.sin(this.time * 0.001 + particle.pulsePhase) * breathFactor;
      
      particle.speedX = Math.cos(angle) * breathEffect * 0.2;
      particle.speedY = Math.sin(angle) * breathEffect * 0.2;
      particle.speedX += (Math.random() - 0.5) * 0.1;
      particle.speedY += (Math.random() - 0.5) * 0.1;
      
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      particle.size = (1 + Math.sin(this.time * 0.005 + particle.pulsePhase) * 0.5) * 
                     (1 + breathFactor * 0.5);
      
      const lifeFactor = 1 - (particle.life / particle.maxLife);
      const themeColor = this.getThemeColor('base');
      const pulseColor = this.getThemeColor('pulse');
      particle.color = {
        r: themeColor.r + (pulseColor.r - themeColor.r) * lifeFactor,
        g: themeColor.g + (pulseColor.g - themeColor.g) * lifeFactor,
        b: themeColor.b + (pulseColor.b - themeColor.b) * lifeFactor
      };
    });
  }

  private updateThermalWaves(deltaTime: number): void {
    if (!this.canvas) return;
    
    const intensity = this.getParameter('thermalDistortion');
    if (intensity < 0.1) return;
    
    this.thermalWaves.forEach(wave => {
      wave.life += deltaTime * 0.001 * wave.speed;
      if (wave.life > 1) {
        wave.life = 0;
        wave.x = Math.random() * this.canvas!.width;
        wave.y = Math.random() * this.canvas!.height;
        wave.intensity = 0.3 + Math.random() * 0.7;
      }
      
      const progress = wave.life;
      wave.radius = progress * wave.maxRadius;
      wave.currentIntensity = wave.intensity * (1 - progress) * intensity;
    });
  }

  private updateVolumetricRays(deltaTime: number): void {
    const intensity = this.getParameter('volumetricLight');
    if (intensity < 0.1) return;
    
    this.volumetricRays.forEach(ray => {
      ray.pulsePhase += deltaTime * 0.001 * ray.speed;
      
      const breathEffect = this.profondeurRespiration * 0.7 + 0.3;
      ray.length = ray.maxLength * breathEffect * 
                  (0.7 + Math.sin(ray.pulsePhase) * 0.3);
      
      ray.currentOpacity = ray.opacity * intensity * 
                          (0.8 + Math.sin(this.time * 0.001 * this.frequenceCardiaque / 60) * 0.2);
    });
  }

  private updateHaloLayers(deltaTime: number): void {
    const intensity = this.getParameter('haloIntensity');
    if (intensity < 0.1) return;
    
    this.haloLayers.forEach(layer => {
      layer.pulsePhase += deltaTime * 0.001 * layer.pulseSpeed;
      
      const breathEffect = this.profondeurRespiration * 0.5 + 0.5;
      const pulseEffect = Math.sin(layer.pulsePhase) * 0.2 + 0.8;
      layer.currentRadius = layer.radius * breathEffect * pulseEffect;
      layer.currentOpacity = layer.opacity * intensity * pulseEffect;
    });
  }

  private renderThermalDistortion(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
    if (this.getParameter('thermalDistortion') < 0.1) return;
    
    this.thermalWaves.forEach(wave => {
      if (wave.currentIntensity < 0.05) return;
      
      const gradient = ctx.createRadialGradient(
        wave.x, wave.y, 0,
        wave.x, wave.y, wave.radius
      );
      
      const alpha = wave.currentIntensity * 0.1;
      const themeColor = this.getThemeColor('base');
      
      gradient.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${alpha})`);
      gradient.addColorStop(0.7, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private renderVolumetricLight(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
    if (this.getParameter('volumetricLight') < 0.1) return;
    
    this.volumetricRays.forEach(ray => {
      if (ray.currentOpacity < 0.02) return;
      
      const endX = centerX + Math.cos(ray.angle) * ray.length;
      const endY = centerY + Math.sin(ray.angle) * ray.length;
      
      const gradient = ctx.createLinearGradient(centerX, centerY, endX, endY);
      const themeColor = this.getThemeColor('highlight');
      
      gradient.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${ray.currentOpacity})`);
      gradient.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0)`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = ray.width;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    });
  }

  private renderHaloLayers(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
    if (this.getParameter('haloIntensity') < 0.1) return;
    
    this.haloLayers.forEach((layer, index) => {
      if (layer.currentOpacity < 0.02) return;
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, layer.currentRadius
      );
      
      const alpha = layer.currentOpacity * (1 - index * 0.2);
      const themeColor = layer.color;
      
      gradient.addColorStop(0, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${alpha})`);
      gradient.addColorStop(0.7, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, layer.currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private renderCirculationSanguine(ctx: CanvasRenderingContext2D, centerX: number, centerY: number): void {
    const circulation = this.getParameter('circulation');
    if (circulation < 0.1) return;
    
    const breathCycle = Math.sin(this.time * 0.001) * 0.5 + 0.5;
    const radius = 100 + breathCycle * this.getParameter('amplitude') * 100;
    
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, radius
    );
    
    const themeColor = this.getThemeColor('base');
    const pulseColor = this.getThemeColor('pulse');
    const intensity = this.getParameter('intensite');
    
    gradient.addColorStop(0, `rgba(${pulseColor.r}, ${pulseColor.g}, ${pulseColor.b}, ${intensity * circulation * 0.8})`);
    gradient.addColorStop(0.5, `rgba(${themeColor.r}, ${themeColor.g}, ${themeColor.b}, ${intensity * circulation * 0.4})`);
    gradient.addColorStop(1, 'rgba(255, 220, 180, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderParticles(ctx: CanvasRenderingContext2D): void {
    // Force minimum particle visibility
    const intensity = Math.max(this.getParameter('particleDensity'), 0.4);
    
    this.particles.forEach(particle => {
      const lifeFactor = 1 - (particle.life / particle.maxLife);
      const alpha = Math.max(0.3, lifeFactor * intensity);
      
      if (alpha < 0.1) return;
      
      // Enhanced particle rendering with multiple layers
      ctx.save();
      
      // Outer glow
      ctx.shadowBlur = 12;
      ctx.shadowColor = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.5})`;
      ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 1.8, 0, Math.PI * 2);
      ctx.fill();
      
      // Main particle
      ctx.shadowBlur = 6;
      ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Bright core
      ctx.shadowBlur = 3;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
      // Render connections between nearby particles
      if (particle.connected && alpha > 0.2) {
        this.particles.forEach(other => {
          if (other === particle || !other.connected) return;
          
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const connectionAlpha = (1 - distance / 120) * alpha * 0.4;
            ctx.strokeStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${connectionAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      }
    });
  }

  reset(): void {
    this.time = 0;
    this.cycleRespiration = 0;
    this.profondeurRespiration = 1;
    
    if (this.canvas) {
      this.initParticles();
      this.initThermalWaves();
      this.initVolumetricRays();
      this.initHaloLayers();
    }
  }

  destroy(): void {
    this.particles = [];
    this.thermalWaves = [];
    this.volumetricRays = [];
    this.haloLayers = [];
  }
}
