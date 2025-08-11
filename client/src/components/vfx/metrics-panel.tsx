interface MetricsPanelProps {
  metrics: {
    fps: number;
    memory: number;
    cpu: number;
    frameTime: number;
    stability: string;
    quality: string;
  };
}

export default function MetricsPanel({ metrics }: MetricsPanelProps) {
  const getMetricColor = (value: number, type: 'fps' | 'memory' | 'cpu') => {
    switch (type) {
      case 'fps':
        if (value > 55) return 'text-success';
        if (value > 30) return 'text-warning';
        return 'text-destructive';
      case 'memory':
        if (value < 50) return 'text-success';
        if (value < 100) return 'text-warning';
        return 'text-destructive';
      case 'cpu':
        if (value < 20) return 'text-success';
        if (value < 50) return 'text-warning';
        return 'text-destructive';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="text-lg font-rajdhani font-bold text-primary flex items-center gap-2">
          <i className="fas fa-chart-bar"></i> Real-time Performance Metrics
        </h3>
      </div>
      
      <div className="p-5 flex gap-5 h-full">
        <div className="metric-card">
          <div className={`metric-value ${getMetricColor(metrics.fps, 'fps')}`} data-testid="metric-fps">
            {Math.round(metrics.fps)}
          </div>
          <div className="metric-label">FPS</div>
        </div>
        
        <div className="metric-card">
          <div className={`metric-value ${getMetricColor(metrics.memory, 'memory')}`} data-testid="metric-memory">
            {Math.round(metrics.memory)}
          </div>
          <div className="metric-label">Memory (MB)</div>
        </div>
        
        <div className="metric-card">
          <div className={`metric-value ${getMetricColor(metrics.cpu, 'cpu')}`} data-testid="metric-cpu">
            {Math.round(metrics.cpu)}
          </div>
          <div className="metric-label">CPU Usage (%)</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value text-info" data-testid="metric-frame-time">
            {metrics.frameTime.toFixed(1)}
          </div>
          <div className="metric-label">Frame Time (ms)</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value text-2xl" data-testid="metric-stability">
            {metrics.stability}
          </div>
          <div className="metric-label">Stability</div>
        </div>
        
        <div className="metric-card">
          <div className={`metric-value text-sm ${
            metrics.quality === 'HIGH' ? 'text-success' : 
            metrics.quality === 'MEDIUM' ? 'text-warning' : 'text-destructive'
          }`} data-testid="metric-quality">
            {metrics.quality}
          </div>
          <div className="metric-label">Quality Level</div>
        </div>
      </div>
    </div>
  );
}
