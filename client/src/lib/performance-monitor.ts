export interface PerformanceMetrics {
  fps: number;
  memory: number;
  cpu: number;
  frameTime: number;
  stability: string;
  quality: string;
}

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private frameTimeHistory: number[] = [];
  private intervalId: number | null = null;
  private startTime = 0;
  
  public onUpdate: ((metrics: PerformanceMetrics) => void) | null = null;

  start(): void {
    this.startTime = Date.now();
    this.lastTime = performance.now();
    
    // Start monitoring loop
    this.intervalId = window.setInterval(() => {
      this.updateMetrics();
    }, 1000);
    
    // Start frame time tracking
    this.trackFrameTime();
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private trackFrameTime(): void {
    const track = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastTime;
      
      this.frameCount++;
      this.frameTimeHistory.push(deltaTime);
      
      if (this.frameTimeHistory.length > 60) {
        this.frameTimeHistory.shift();
      }
      
      // Calculate FPS every 60 frames
      if (this.frameCount % 60 === 0) {
        const avgFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
        this.fps = Math.min(60, 1000 / avgFrameTime);
      }
      
      this.lastTime = currentTime;
      requestAnimationFrame(track);
    };
    
    requestAnimationFrame(track);
  }

  private updateMetrics(): void {
    if (!this.onUpdate) return;
    
    // Simulate memory usage (in reality, this would use performance.memory if available)
    const baseMemory = 45;
    const memoryVariation = Math.sin(Date.now() * 0.001) * 10;
    const memory = Math.max(20, baseMemory + memoryVariation + (this.fps < 30 ? 20 : 0));
    
    // Simulate CPU usage based on FPS performance
    const baseCpu = 12;
    const cpuVariation = Math.random() * 8;
    const performancePenalty = this.fps < 30 ? 25 : this.fps < 45 ? 15 : 0;
    const cpu = Math.min(100, baseCpu + cpuVariation + performancePenalty);
    
    // Calculate frame time
    const avgFrameTime = this.frameTimeHistory.length > 0 
      ? this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length
      : 16.67;
    
    // Determine stability
    let stability = '✅';
    let quality = 'HIGH';
    
    if (this.fps < 30) {
      stability = '❌';
      quality = 'LOW';
    } else if (this.fps < 45) {
      stability = '⚠️';
      quality = 'MEDIUM';
    }
    
    // Check for frame time variance (stability indicator)
    if (this.frameTimeHistory.length >= 10) {
      const variance = this.calculateVariance(this.frameTimeHistory.slice(-10));
      if (variance > 100) {
        stability = '⚠️';
        if (quality === 'HIGH') quality = 'MEDIUM';
      }
    }
    
    const metrics: PerformanceMetrics = {
      fps: Math.round(this.fps),
      memory: Math.round(memory),
      cpu: Math.round(cpu),
      frameTime: Number(avgFrameTime.toFixed(1)),
      stability,
      quality
    };
    
    this.onUpdate(metrics);
  }

  private calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numbers.length;
    return variance;
  }

  getSessionDuration(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  getCurrentFPS(): number {
    return this.fps;
  }
}
