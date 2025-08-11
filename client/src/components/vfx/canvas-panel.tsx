import { useEffect, useRef } from "react";

interface CanvasPanelProps {
  currentEffect: any;
  isPlaying: boolean;
  metrics: {
    fps: number;
    memory: number;
    cpu: number;
    frameTime: number;
    stability: string;
    quality: string;
  };
}

export default function CanvasPanel({ currentEffect, isPlaying, metrics }: CanvasPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastFrameTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentEffect) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize effect with canvas
    if (currentEffect.initialize) {
      currentEffect.initialize(canvas);
    }

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTimeRef.current;
      lastFrameTimeRef.current = currentTime;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Always render effect
      if (currentEffect.render) {
        currentEffect.render(ctx, deltaTime);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentEffect, isPlaying]);

  const getStatusColor = () => {
    if (metrics.fps > 55) return 'text-success';
    if (metrics.fps > 30) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusText = () => {
    if (metrics.fps > 55) return 'OPTIMAL';
    if (metrics.fps > 30) return 'MODERATE';
    return 'POOR';
  };

  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-rajdhani font-bold text-primary">Preview Canvas</h3>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-2">
              <i className="fas fa-expand text-muted-foreground"></i>
              <span className="font-semibold" data-testid="text-canvas-dimensions">800x600</span>
            </span>
            <span className="flex items-center gap-2">
              <i className="fas fa-tachometer-alt text-muted-foreground"></i>
              <span className={`font-semibold ${getStatusColor()}`} data-testid="text-current-fps">
                {metrics.fps} FPS
              </span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-5 relative bg-gradient-radial from-primary/5 to-transparent">
        <canvas
          ref={canvasRef}
          id="effectCanvas"
          width={800}
          height={600}
          className="bg-black/50 rounded-lg shadow-2xl shadow-primary/30 max-w-full max-h-full"
          data-testid="canvas-preview"
        />
        
        {/* Canvas Overlay Controls */}
        <div className="absolute top-5 right-5 bg-card/80 backdrop-blur-sm rounded-lg p-3 flex gap-3 text-sm border border-border">
          <div className="flex items-center gap-2">
            <i className="fas fa-memory text-muted-foreground"></i>
            <span data-testid="text-memory-overlay">{metrics.memory}MB</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-microchip text-muted-foreground"></i>
            <span data-testid="text-cpu-overlay">{metrics.cpu}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              metrics.fps > 55 ? 'bg-success' : metrics.fps > 30 ? 'bg-warning' : 'bg-destructive'
            }`}></span>
            <span className={getStatusColor()} data-testid="text-status-overlay">
              {getStatusText()}
            </span>
          </div>
        </div>

        {/* Loading/Error States */}
        {!currentEffect && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <i className="fas fa-magic text-4xl text-muted-foreground mb-4"></i>
              <p className="text-muted-foreground">No effect selected</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Choose an effect from the library</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
