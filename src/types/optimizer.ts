export type MediaType = 'image' | 'video';

export type ImageFormat = 'original' | 'jpeg' | 'png' | 'webp' | 'avif';

export type VideoFormat = 'original' | 'mp4' | 'webm';

export type VideoResolution = 'original' | '1080p' | '720p' | '480p' | '360p' | 'custom';

export type ResizeMode = 'none' | 'fit' | 'percentage' | 'exact';

export interface ImageSettings {
  format: ImageFormat;
  quality: number; // 1 - 100 (e.g. 92 - 95 for high quality)
  resizeMode: ResizeMode;
  maxWidth: number;
  maxHeight: number;
  scalePercent: number; // 10 - 100
  exactWidth: number;
  exactHeight: number;
  stripMetadata: boolean;
  grayscale: boolean;
  sharpen: boolean;
}

export interface VideoSettings {
  format: VideoFormat;
  resolution: VideoResolution;
  customWidth: number;
  customHeight: number;
  fps: 15 | 24 | 30 | 60 | 'auto';
  videoBitrateKbps: number; // targeted high-quality bitrate
  audioOption: 'keep' | 'compress';
  audioBitrateKbps: 64 | 128 | 192;
  trimEnabled: boolean;
  startTime: number; // in seconds
  endTime: number; // in seconds
}

export type PresetId = 'custom' | 'web-fast' | 'discord-8mb' | 'discord-25mb' | 'mobile' | 'lossless';

export interface Preset {
  id: PresetId;
  name: string;
  tagline: string;
  imageSettings: Partial<ImageSettings>;
  videoSettings: Partial<VideoSettings>;
}

export interface MediaItem {
  id: string;
  file: File;
  type: MediaType;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalDuration?: number;
  originalFps?: number;
  originalFormat: string; // e.g. 'MP4', 'WebM', 'JPG', 'PNG'
  originalUrl: string;

  // Optimized state
  optimizedSize?: number;
  optimizedWidth?: number;
  optimizedHeight?: number;
  optimizedDuration?: number;
  optimizedFormat?: string;
  optimizedUrl?: string;
  optimizedBlob?: Blob;
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number; // 0 - 100
  etaSeconds?: number;
  speed?: string;
  isRemux?: boolean;
  keptOriginal?: boolean;
  isLarger?: boolean;
  warning?: string;
  actualReductionPercent?: number;
  rawCompressedBlob?: Blob;
  rawCompressedSize?: number;
  error?: string;
  psnr?: number;
  ssim?: number;
  processingTimeMs?: number;
  jobId?: string;
}
