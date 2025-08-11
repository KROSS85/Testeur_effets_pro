import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import EffectsPanel from "@/components/vfx/effects-panel";
import CanvasPanel from "@/components/vfx/canvas-panel";
import ParametersPanel from "@/components/vfx/parameters-panel";
import MetricsPanel from "@/components/vfx/metrics-panel";
import TimelineControls from "@/components/vfx/timeline-controls";
import SettingsDialog from "@/components/vfx/settings-dialog";
import AnalyticsDialog from "@/components/vfx/analytics-dialog";
import { PerformanceMonitor } from "@/lib/performance-monitor";
import { CanvasRecorder } from "@/lib/canvas-recorder";
import { OrganicLifeRespirationPro } from "@/lib/effects/organic-life-respiration-pro";
import type { Effect } from "@shared/schema";

export default function VFXTester() {
  const [currentEffect, setCurrentEffect] = useState<any>(null);
  const [selectedEffectId, setSelectedEffectId] = useState<string>('organic-life-respiration-pro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [performanceMonitor, setPerformanceMonitor] = useState<PerformanceMonitor | null>(null);
  const [canvasRecorder, setCanvasRecorder] = useState<CanvasRecorder | null>(null);
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 45,
    cpu: 12,
    frameTime: 16.7,
    stability: '✅',
    quality: 'HIGH'
  });

  const { data: effects, isLoading } = useQuery({
    queryKey: ['/api/effects'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize performance monitoring
  useEffect(() => {
    const monitor = new PerformanceMonitor();
    monitor.onUpdate = (newMetrics) => {
      setMetrics(newMetrics);
    };
    monitor.start();
    setPerformanceMonitor(monitor);

    // Create background animation
    createBackgroundParticles();

    return () => {
      monitor.stop();
    };
  }, []);

  // Load default effect on mount
  useEffect(() => {
    if (!currentEffect && selectedEffectId === 'organic-life-respiration-pro') {
      const effect = new OrganicLifeRespirationPro();
      setCurrentEffect(effect);
      setParameters(effect.getParameters());
      setIsPlaying(true); // Start playing automatically
    }
  }, [currentEffect, selectedEffectId]);

  const createBackgroundParticles = () => {
    const particleContainer = document.querySelector('.bg-particles');
    if (!particleContainer) return;

    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 20 + 's';
        particleContainer.appendChild(particle);
      }, i * 200);
    }
  };

  const handleEffectSelect = async (effectId: string) => {
    setSelectedEffectId(effectId);
    
    if (effectId === 'organic-life-respiration-pro') {
      const effect = new OrganicLifeRespirationPro();
      setCurrentEffect(effect);
      setParameters(effect.getParameters());
    } else {
      // Handle custom effects loaded from server
      const effectData = Array.isArray(effects) ? effects.find((e: Effect) => e.id === effectId) : null;
      if (effectData) {
        try {
          // Dynamic loading of custom effects would go here
          console.log('Loading custom effect:', effectData.name);
        } catch (error) {
          console.error('Failed to load custom effect:', error);
        }
      }
    }
  };

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters(prev => ({ ...prev, [paramName]: value }));
    if (currentEffect && currentEffect.updateParameter) {
      currentEffect.updateParameter(paramName, value);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    if (currentEffect && currentEffect.start) {
      currentEffect.start();
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (currentEffect && currentEffect.pause) {
      currentEffect.pause();
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (currentEffect && currentEffect.reset) {
      currentEffect.reset();
    }
  };

  const handleExportScreenshot = async (canvas: HTMLCanvasElement) => {
    try {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `effect-screenshot-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    } catch (error) {
      console.error('Failed to export screenshot:', error);
    }
  };

  const handleExportVideo = async (canvas: HTMLCanvasElement) => {
    if (!canvasRecorder) {
      const recorder = new CanvasRecorder(canvas);
      setCanvasRecorder(recorder);
      try {
        await recorder.startRecording();
        setTimeout(async () => {
          const blob = await recorder.stopRecording();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `effect-video-${Date.now()}.webm`;
          link.click();
          URL.revokeObjectURL(url);
        }, 5000); // Record for 5 seconds
      } catch (error) {
        console.error('Failed to start video recording:', error);
      }
    }
  };

  const handleExportReport = () => {
    const report = {
      effect: currentEffect?.name || 'Unknown',
      timestamp: new Date().toISOString(),
      performance: metrics,
      parameters: parameters,
      session: {
        duration: performanceMonitor?.getSessionDuration() || 0,
        stability: metrics.fps > 55 ? 'stable' : metrics.fps > 30 ? 'moderate' : 'unstable'
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `effect-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-2xl logo-icon mb-4">
            🧪
          </div>
          <p className="text-muted-foreground">Loading VFX Tester Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Animation */}
      <div className="bg-animation">
        <div className="bg-grid"></div>
        <div className="bg-particles"></div>
      </div>

      {/* Header */}
      <header className="header-container p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-2xl logo-icon">
              🧪
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VFX TESTER PRO
              </h1>
              <span className="text-xs text-muted-foreground">Professional Visual Effects Testing Studio</span>
            </div>
          </div>
          <div className="flex gap-3">
            <SettingsDialog
              trigger={
                <button 
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
                  data-testid="button-settings"
                >
                  <i className="fas fa-cog"></i> Settings
                </button>
              }
            />
            <AnalyticsDialog
              trigger={
                <button 
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
                  data-testid="button-analytics"
                >
                  <i className="fas fa-chart-line"></i> Analytics
                </button>
              }
              metrics={metrics}
            />
            <div className="relative">
              <button 
                className="px-4 py-2 bg-gradient-to-r from-primary to-accent rounded-lg text-sm font-semibold text-white flex items-center gap-2"
                data-testid="button-export"
                onClick={() => {
                  // Show export menu
                  const menu = document.createElement('div');
                  menu.className = 'absolute top-12 right-0 bg-card/90 backdrop-blur-sm rounded-lg p-3 z-50 min-w-48 border border-border';
                  menu.innerHTML = `
                    <button class="block w-full text-left p-2 hover:bg-white/10 rounded text-sm" data-action="screenshot">
                      📷 Screenshot (PNG)
                    </button>
                    <button class="block w-full text-left p-2 hover:bg-white/10 rounded text-sm" data-action="video">
                      🎥 Video (WebM)
                    </button>
                    <button class="block w-full text-left p-2 hover:bg-white/10 rounded text-sm" data-action="report">
                      📋 Performance Report (JSON)
                    </button>
                  `;
                  
                  menu.addEventListener('click', (e) => {
                    const target = e.target as HTMLElement;
                    const action = target.getAttribute('data-action');
                    const canvas = document.getElementById('effectCanvas') as HTMLCanvasElement;
                    
                    if (action === 'screenshot' && canvas) {
                      handleExportScreenshot(canvas);
                    } else if (action === 'video' && canvas) {
                      handleExportVideo(canvas);
                    } else if (action === 'report') {
                      handleExportReport();
                    }
                    
                    menu.remove();
                  });
                  
                  document.body.appendChild(menu);
                  setTimeout(() => menu.remove(), 5000);
                }}
              >
                <i className="fas fa-download"></i> Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] grid-rows-[1fr_auto] h-[calc(100vh-80px)] gap-5 p-5">
        {/* Effects Panel */}
        <div className="lg:col-span-1 lg:row-span-1">
          <EffectsPanel
            effects={(effects as Effect[]) || []}
            selectedEffectId={selectedEffectId}
            onEffectSelect={handleEffectSelect}
          />
        </div>

        {/* Canvas Panel */}
        <div className="lg:col-span-1 lg:row-span-1 flex flex-col">
          <CanvasPanel
            currentEffect={currentEffect}
            isPlaying={isPlaying}
            metrics={metrics}
          />
          <div className="mt-3">
            <TimelineControls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onReset={handleReset}
              duration={100}
              currentTime={Math.floor(Date.now() / 1000) % 100}
            />
          </div>
        </div>

        {/* Parameters Panel */}
        <div className="lg:col-span-1 lg:row-span-1">
          <ParametersPanel
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            isPlaying={isPlaying}
          />
        </div>

        {/* Metrics Panel */}
        <div className="lg:col-span-3 lg:row-span-1">
          <MetricsPanel metrics={metrics} />
        </div>
      </div>
    </div>
  );
}
