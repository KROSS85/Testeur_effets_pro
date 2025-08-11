import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Effect } from "@shared/schema";

interface EffectsPanelProps {
  effects: Effect[];
  selectedEffectId: string;
  onEffectSelect: (effectId: string) => void;
}

export default function EffectsPanel({ effects, selectedEffectId, onEffectSelect }: EffectsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('effectFile', file);
      const response = await apiRequest('POST', '/api/effects', formData);
      return response.json();
    },
    onSuccess: (newEffect) => {
      queryClient.invalidateQueries({ queryKey: ['/api/effects'] });
      toast({
        title: "Effect uploaded successfully",
        description: `${newEffect.name} has been added to your library.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredEffects = effects.filter(effect => 
    effect.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'application/javascript' || file.name.endsWith('.js')) {
        uploadMutation.mutate(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Only JavaScript (.js) files are allowed.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h3 className="text-lg font-rajdhani font-bold text-primary flex items-center gap-2">
          <i className="fas fa-folder-open"></i> Effects Library
        </h3>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        {/* Search Box */}
        <div className="relative mb-5">
          <input 
            type="text" 
            placeholder="Search effects..." 
            className="w-full bg-white/5 border border-white/10 text-foreground px-10 py-2 rounded-lg text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-effects"
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
        </div>

        {/* Upload Area */}
        <div 
          className={`upload-area ${dragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.js';
            input.multiple = true;
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              handleFileUpload(target.files);
            };
            input.click();
          }}
          data-testid="area-upload"
        >
          <i className="fas fa-cloud-upload-alt text-2xl text-primary mb-2"></i>
          <p className="text-sm text-muted-foreground">Drag & drop .js files here</p>
          <p className="text-xs text-muted-foreground/70 mt-1">or click to browse</p>
          {uploadMutation.isPending && (
            <div className="mt-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}
        </div>

        {/* Effects List */}
        <div className="flex-1 overflow-y-auto" data-testid="list-effects">
          {filteredEffects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <i className="fas fa-search text-2xl mb-2"></i>
              <p>No effects found</p>
              <p className="text-xs mt-1">Try uploading some .js effect files</p>
            </div>
          ) : (
            filteredEffects.map((effect) => (
              <div
                key={effect.id}
                className={`effect-item ${selectedEffectId === effect.id ? 'active' : ''}`}
                onClick={() => onEffectSelect(effect.id)}
                data-testid={`effect-item-${effect.id}`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-lg">
                  {effect.id === 'organic-life-respiration-pro' ? '🫁' : '✨'}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{effect.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {effect.id === 'organic-life-respiration-pro' ? 'Biological Animation' : 'Custom Effect'}
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-success"></div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
