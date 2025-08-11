export interface EffectParameter {
  type: 'range' | 'select' | 'boolean' | 'color';
  min?: number;
  max?: number;
  default: any;
  options?: string[];
  step?: number;
  value?: any;
}

export interface EffectConfig {
  id: string;
  name: string;
  category: string;
  version: string;
  performance: 'low' | 'medium' | 'high';
  parameters: Record<string, EffectParameter>;
}

export abstract class BaseEffect {
  protected config: EffectConfig;
  protected parameters: Record<string, EffectParameter>;
  protected canvas: HTMLCanvasElement | null = null;
  protected ctx: CanvasRenderingContext2D | null = null;

  constructor(config: EffectConfig) {
    this.config = config;
    this.parameters = { ...config.parameters };
    
    // Initialize parameter values
    Object.keys(this.parameters).forEach(key => {
      if (!this.parameters[key].hasOwnProperty('value')) {
        this.parameters[key].value = this.parameters[key].default;
      }
    });
  }

  get name(): string {
    return this.config.name;
  }

  get id(): string {
    return this.config.id;
  }

  getParameters(): Record<string, EffectParameter> {
    return this.parameters;
  }

  updateParameter(key: string, value: any): void {
    if (this.parameters[key]) {
      this.parameters[key].value = value;
    }
  }

  getParameter(key: string): any {
    return this.parameters[key]?.value ?? this.parameters[key]?.default;
  }

  abstract initialize(canvas: HTMLCanvasElement): Promise<void> | void;
  abstract render(ctx: CanvasRenderingContext2D, deltaTime: number): void;
  abstract reset?(): void;
  abstract destroy?(): void;

  // Optional static render for when paused
  renderStatic?(ctx: CanvasRenderingContext2D): void;
}
