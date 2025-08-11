import { useState, useEffect } from "react";

interface TimelineControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSeek?: (position: number) => void;
  duration?: number;
  currentTime?: number;
}

export default function TimelineControls({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onSeek,
  duration = 100,
  currentTime = 0
}: TimelineControlsProps) {
  const [timelineValue, setTimelineValue] = useState(0);
  const [loop, setLoop] = useState(true);

  useEffect(() => {
    setTimelineValue(currentTime);
  }, [currentTime]);

  const handleTimelineChange = (value: number) => {
    setTimelineValue(value);
    if (onSeek) {
      onSeek(value);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border mb-5">
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
            isPlaying 
              ? 'bg-warning text-warning-foreground hover:bg-warning/80' 
              : 'bg-primary text-primary-foreground hover:bg-primary/80'
          }`}
          onClick={isPlaying ? onPause : onPlay}
          data-testid={isPlaying ? "button-pause-main" : "button-play-main"}
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
        </button>

        {/* Timeline */}
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-mono min-w-[50px]">
            {formatTime(timelineValue)}
          </span>
          
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max={duration}
              value={timelineValue}
              onChange={(e) => handleTimelineChange(Number(e.target.value))}
              className="parameter-slider w-full"
              data-testid="slider-timeline-main"
            />
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-accent rounded-full pointer-events-none"
              style={{ width: `${(timelineValue / duration) * 100}%` }}
            ></div>
          </div>
          
          <span className="text-sm text-muted-foreground font-mono min-w-[50px]">
            {formatTime(duration)}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <button
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
            onClick={onReset}
            data-testid="button-reset-main"
          >
            <i className="fas fa-redo text-sm"></i>
          </button>
          
          <button
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              loop 
                ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                : 'bg-white/10 hover:bg-white/20 text-muted-foreground'
            }`}
            onClick={() => setLoop(!loop)}
            data-testid="button-loop-main"
          >
            <i className="fas fa-sync text-sm"></i>
          </button>
          
          <button
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
            data-testid="button-fullscreen"
          >
            <i className="fas fa-expand text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}