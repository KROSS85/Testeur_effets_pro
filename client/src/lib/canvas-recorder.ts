export class CanvasRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private canvas: HTMLCanvasElement;
  private stream: MediaStream | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async startRecording(): Promise<void> {
    try {
      // Get canvas stream
      this.stream = this.canvas.captureStream(30); // 30 FPS
      
      if (!this.stream) {
        throw new Error('Failed to capture canvas stream');
      }

      // Check for MediaRecorder support
      if (!MediaRecorder.isTypeSupported('video/webm')) {
        throw new Error('WebM recording is not supported');
      }

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm',
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      });

      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      
    } catch (error) {
      throw new Error(`Failed to start recording: ${error}`);
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.cleanup();
        resolve(blob);
      };

      this.mediaRecorder.onerror = (error) => {
        this.cleanup();
        reject(error);
      };

      this.mediaRecorder.stop();
    });
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  // Create a GIF from the recorded video (simplified version)
  async createGIF(duration: number = 5000): Promise<Blob> {
    // This is a simplified implementation
    // In a real scenario, you'd use a library like gif.js
    throw new Error('GIF creation not implemented - use third-party library like gif.js');
  }
}
