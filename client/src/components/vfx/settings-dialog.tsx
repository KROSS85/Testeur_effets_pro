import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface SettingsDialogProps {
  trigger: React.ReactNode;
}

export default function SettingsDialog({ trigger }: SettingsDialogProps) {
  const [settings, setSettings] = useState({
    canvasQuality: "high",
    autoSave: true,
    showFPS: true,
    enablePerfMonitoring: true,
    maxFPS: 60,
    enableGPUAcceleration: true,
    recordingQuality: "1080p",
    backgroundParticles: true,
    soundEnabled: false,
    theme: "cyberpunk-blue"
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-md border border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-rajdhani font-bold text-primary flex items-center gap-2">
            <i className="fas fa-cog"></i>
            VFX Studio Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Canvas Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">
              Canvas & Rendering
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="canvasQuality">Canvas Quality</Label>
                <Select value={settings.canvasQuality} onValueChange={(value) => updateSetting("canvasQuality", value)}>
                  <SelectTrigger data-testid="select-canvas-quality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (512x384)</SelectItem>
                    <SelectItem value="medium">Medium (800x600)</SelectItem>
                    <SelectItem value="high">High (1280x720)</SelectItem>
                    <SelectItem value="ultra">Ultra (1920x1080)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxFPS">Max FPS</Label>
                <div className="space-y-2">
                  <Slider
                    value={[settings.maxFPS]}
                    onValueChange={([value]) => updateSetting("maxFPS", value)}
                    max={120}
                    min={30}
                    step={10}
                    data-testid="slider-max-fps"
                  />
                  <span className="text-sm text-muted-foreground">{settings.maxFPS} FPS</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="gpuAcceleration">GPU Acceleration</Label>
              <Switch
                id="gpuAcceleration"
                checked={settings.enableGPUAcceleration}
                onCheckedChange={(checked) => updateSetting("enableGPUAcceleration", checked)}
                data-testid="switch-gpu-acceleration"
              />
            </div>
          </div>

          {/* Performance Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">
              Performance Monitoring
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="showFPS">Show FPS Counter</Label>
                <Switch
                  id="showFPS"
                  checked={settings.showFPS}
                  onCheckedChange={(checked) => updateSetting("showFPS", checked)}
                  data-testid="switch-show-fps"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="perfMonitoring">Real-time Performance Monitoring</Label>
                <Switch
                  id="perfMonitoring"
                  checked={settings.enablePerfMonitoring}
                  onCheckedChange={(checked) => updateSetting("enablePerfMonitoring", checked)}
                  data-testid="switch-perf-monitoring"
                />
              </div>
            </div>
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">
              Visual & Interface
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="theme">Color Theme</Label>
                <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
                  <SelectTrigger data-testid="select-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cyberpunk-blue">Cyberpunk Blue</SelectItem>
                    <SelectItem value="cyberpunk-purple">Cyberpunk Purple</SelectItem>
                    <SelectItem value="cyberpunk-green">Cyberpunk Green</SelectItem>
                    <SelectItem value="neon-pink">Neon Pink</SelectItem>
                    <SelectItem value="matrix-green">Matrix Green</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="backgroundParticles">Background Particles</Label>
                <Switch
                  id="backgroundParticles"
                  checked={settings.backgroundParticles}
                  onCheckedChange={(checked) => updateSetting("backgroundParticles", checked)}
                  data-testid="switch-bg-particles"
                />
              </div>
            </div>
          </div>

          {/* Export Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b border-primary/20 pb-2">
              Export & Recording
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recordingQuality">Recording Quality</Label>
                <Select value={settings.recordingQuality} onValueChange={(value) => updateSetting("recordingQuality", value)}>
                  <SelectTrigger data-testid="select-recording-quality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p (HD)</SelectItem>
                    <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                    <SelectItem value="1440p">1440p (2K)</SelectItem>
                    <SelectItem value="2160p">2160p (4K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSave">Auto-save Projects</Label>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting("autoSave", checked)}
                  data-testid="switch-auto-save"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-primary/20">
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
            Reset to Defaults
          </Button>
          <Button className="bg-primary hover:bg-primary/80">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}