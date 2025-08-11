import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

interface AnalyticsDialogProps {
  trigger: React.ReactNode;
  metrics: {
    fps: number;
    memory: number;
    cpu: number;
    frameTime: number;
    stability: string;
    quality: string;
  };
}

export default function AnalyticsDialog({ trigger, metrics }: AnalyticsDialogProps) {
  const [sessionData, setSessionData] = useState({
    sessionDuration: 0,
    averageFPS: 60,
    peakFPS: 60,
    minFPS: 60,
    frameDrops: 0,
    memoryPeak: 0,
    cpuPeak: 0,
    effectsLoaded: 1,
    parametersChanged: 0,
    exportsCompleted: 0
  });

  const [performanceHistory, setPerformanceHistory] = useState<Array<{
    time: number;
    fps: number;
    memory: number;
    cpu: number;
  }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionData(prev => ({
        ...prev,
        sessionDuration: prev.sessionDuration + 1,
        averageFPS: (prev.averageFPS + metrics.fps) / 2,
        peakFPS: Math.max(prev.peakFPS, metrics.fps),
        minFPS: Math.min(prev.minFPS, metrics.fps),
        memoryPeak: Math.max(prev.memoryPeak, metrics.memory),
        cpuPeak: Math.max(prev.cpuPeak, metrics.cpu)
      }));

      setPerformanceHistory(prev => {
        const newHistory = [...prev, {
          time: Date.now(),
          fps: metrics.fps,
          memory: metrics.memory,
          cpu: metrics.cpu
        }];
        // Keep only last 50 entries
        return newHistory.slice(-50);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [metrics]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceGrade = () => {
    if (sessionData.averageFPS >= 55) return { grade: 'A+', color: 'text-green-400' };
    if (sessionData.averageFPS >= 45) return { grade: 'A', color: 'text-green-400' };
    if (sessionData.averageFPS >= 35) return { grade: 'B', color: 'text-yellow-400' };
    if (sessionData.averageFPS >= 25) return { grade: 'C', color: 'text-orange-400' };
    return { grade: 'D', color: 'text-red-400' };
  };

  const performance = getPerformanceGrade();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-md border border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-rajdhani font-bold text-primary flex items-center gap-2">
            <i className="fas fa-chart-line"></i>
            Performance Analytics
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Session Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card/40 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-clock text-primary"></i>
                <span className="text-sm text-muted-foreground">Session Time</span>
              </div>
              <div className="text-lg font-bold" data-testid="text-session-duration">
                {formatDuration(sessionData.sessionDuration)}
              </div>
            </div>
            
            <div className="bg-card/40 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-tachometer-alt text-primary"></i>
                <span className="text-sm text-muted-foreground">Avg FPS</span>
              </div>
              <div className="text-lg font-bold" data-testid="text-avg-fps">
                {Math.round(sessionData.averageFPS)}
              </div>
            </div>
            
            <div className="bg-card/40 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-award text-primary"></i>
                <span className="text-sm text-muted-foreground">Grade</span>
              </div>
              <div className={`text-lg font-bold ${performance.color}`} data-testid="text-performance-grade">
                {performance.grade}
              </div>
            </div>
            
            <div className="bg-card/40 rounded-lg p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-layer-group text-primary"></i>
                <span className="text-sm text-muted-foreground">Effects</span>
              </div>
              <div className="text-lg font-bold" data-testid="text-effects-loaded">
                {sessionData.effectsLoaded}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">
              Current Performance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Frame Rate</Label>
                    <span className="text-sm font-mono" data-testid="text-current-fps-analytics">
                      {metrics.fps} FPS
                    </span>
                  </div>
                  <Progress value={(metrics.fps / 60) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Min: {sessionData.minFPS}</span>
                    <span>Peak: {sessionData.peakFPS}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Memory Usage</Label>
                    <span className="text-sm font-mono" data-testid="text-current-memory-analytics">
                      {metrics.memory} MB
                    </span>
                  </div>
                  <Progress value={(metrics.memory / 100) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Current: {metrics.memory}MB</span>
                    <span>Peak: {sessionData.memoryPeak}MB</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>CPU Usage</Label>
                    <span className="text-sm font-mono" data-testid="text-current-cpu-analytics">
                      {metrics.cpu}%
                    </span>
                  </div>
                  <Progress value={metrics.cpu} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Current: {metrics.cpu}%</span>
                    <span>Peak: {sessionData.cpuPeak}%</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Frame Time</Label>
                    <span className="text-sm font-mono" data-testid="text-frame-time-analytics">
                      {metrics.frameTime.toFixed(1)} ms
                    </span>
                  </div>
                  <Progress value={(16.7 / metrics.frameTime) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Target: 16.7ms</span>
                    <span>Status: {metrics.stability}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">
              Session Activity
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-card/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-parameters-changed">
                  {sessionData.parametersChanged}
                </div>
                <div className="text-sm text-muted-foreground">Parameters Changed</div>
              </div>
              
              <div className="bg-card/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-frame-drops">
                  {sessionData.frameDrops}
                </div>
                <div className="text-sm text-muted-foreground">Frame Drops</div>
              </div>
              
              <div className="bg-card/20 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-primary" data-testid="text-exports-completed">
                  {sessionData.exportsCompleted}
                </div>
                <div className="text-sm text-muted-foreground">Exports</div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">
              Performance Recommendations
            </h3>
            
            <div className="space-y-2">
              {sessionData.averageFPS < 30 && (
                <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <i className="fas fa-exclamation-triangle text-orange-400 mt-1"></i>
                  <div>
                    <div className="font-semibold text-orange-400">Low Frame Rate Detected</div>
                    <div className="text-sm text-muted-foreground">
                      Consider reducing canvas quality or effect complexity for better performance.
                    </div>
                  </div>
                </div>
              )}
              
              {metrics.memory > 80 && (
                <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <i className="fas fa-memory text-red-400 mt-1"></i>
                  <div>
                    <div className="font-semibold text-red-400">High Memory Usage</div>
                    <div className="text-sm text-muted-foreground">
                      Memory usage is high. Consider optimizing effect parameters or restarting the session.
                    </div>
                  </div>
                </div>
              )}
              
              {sessionData.averageFPS >= 55 && (
                <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <i className="fas fa-check-circle text-green-400 mt-1"></i>
                  <div>
                    <div className="font-semibold text-green-400">Excellent Performance</div>
                    <div className="text-sm text-muted-foreground">
                      Your system is running VFX effects smoothly. You can increase quality settings if needed.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-primary/20">
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
            Export Report
          </Button>
          <Button className="bg-primary hover:bg-primary/80">
            Reset Analytics
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}