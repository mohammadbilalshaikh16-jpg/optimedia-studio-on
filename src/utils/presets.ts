import { ImageSettings, Preset, PresetId, VideoSettings } from '../types/optimizer';

export const DEFAULT_IMAGE_SETTINGS: ImageSettings = {
  format: 'original',
  quality: 93,
  resizeMode: 'none',
  maxWidth: 1920,
  maxHeight: 1080,
  scalePercent: 100,
  exactWidth: 1920,
  exactHeight: 1080,
  stripMetadata: false,
  grayscale: false,
  sharpen: false,
};

export const DEFAULT_VIDEO_SETTINGS: VideoSettings = {
  format: 'original',
  resolution: 'original',
  customWidth: 1920,
  customHeight: 1080,
  fps: 30,
  videoBitrateKbps: 0, // 0 = auto adaptive rate control (23-25% target reduction)
  audioOption: 'compress',
  audioBitrateKbps: 128,
  trimEnabled: false,
  startTime: 0,
  endTime: 10,
};

export const OPTIMIZATION_PRESETS: Preset[] = [
  {
    id: 'web-fast',
    name: 'Web Fast',
    tagline: 'Aggressive compression for maximum Lighthouse scores and fast page loading',
    imageSettings: {
      format: 'webp',
      quality: 70,
      resizeMode: 'fit',
      maxWidth: 1600,
      maxHeight: 1200,
      stripMetadata: true,
    },
    videoSettings: {
      format: 'webm',
      resolution: '720p',
      fps: 30,
      videoBitrateKbps: 1000,
      audioOption: 'compress',
      audioBitrateKbps: 64,
    },
  },
  {
    id: 'discord-8mb',
    name: 'Discord (8 MB Cap)',
    tagline: 'Fits images and short clips strictly within Discord free upload limits',
    imageSettings: {
      format: 'webp',
      quality: 75,
      resizeMode: 'fit',
      maxWidth: 2048,
      maxHeight: 2048,
      stripMetadata: true,
    },
    videoSettings: {
      format: 'mp4',
      resolution: '720p',
      fps: 30,
      videoBitrateKbps: 1200,
      audioOption: 'compress',
      audioBitrateKbps: 96 as 64 | 128 | 192,
    },
  },
  {
    id: 'mobile',
    name: 'Mobile Lightweight',
    tagline: 'Bandwidth-saving settings optimized for cellular networks and mobile viewports',
    imageSettings: {
      format: 'webp',
      quality: 75,
      resizeMode: 'fit',
      maxWidth: 1280,
      maxHeight: 960,
      stripMetadata: true,
    },
    videoSettings: {
      format: 'webm',
      resolution: '480p',
      fps: 24,
      videoBitrateKbps: 700,
      audioOption: 'compress',
      audioBitrateKbps: 64,
    },
  },
  {
    id: 'lossless',
    name: 'Visually Lossless',
    tagline: 'Imperceptible visual difference while discarding bloat and unseen metadata',
    imageSettings: {
      format: 'webp',
      quality: 92,
      resizeMode: 'none',
      stripMetadata: true,
    },
    videoSettings: {
      format: 'webm',
      resolution: '1080p',
      fps: 30,
      videoBitrateKbps: 4500,
      audioOption: 'keep',
    },
  },
  {
    id: 'custom',
    name: 'Custom Studio',
    tagline: 'Full granular control over resolution, codec, bitrate, audio tracks, and filters',
    imageSettings: {},
    videoSettings: {},
  },
];

export function calculateVideoBitrateForTargetSize(
  targetSizeMB: number,
  durationSec: number,
  audioKbps: number = 96
): number {
  if (durationSec <= 0) return 1500;
  const totalKbps = (targetSizeMB * 8192) / durationSec;
  const videoKbps = Math.max(250, Math.floor(totalKbps * 0.92 - audioKbps));
  return Math.min(15000, videoKbps);
}
