import { generateSampleVideoBlob } from './videoOptimizer';

export interface SampleMediaDefinition {
  id: string;
  name: string;
  type: 'image' | 'video';
  description: string;
  format: string;
  url?: string;
}

export const SAMPLE_MEDIAS: SampleMediaDefinition[] = [
  {
    id: 'sample-urban-4k',
    name: 'Modern Architecture Twilight.jpg',
    type: 'image',
    description: 'JPG photo with high-frequency details (preserves JPG)',
    format: 'JPEG',
    url: '/src/assets/images/sample_urban_architecture_1790865911921.jpg',
  },
  {
    id: 'sample-lens-sensor',
    name: 'Precision Optics Sensor.png',
    type: 'image',
    description: 'PNG graphic with transparency and clean vectors (preserves PNG)',
    format: 'PNG',
    url: '/src/assets/images/sample_isometric_device_1790865928184.jpg',
  },
  {
    id: 'sample-motion-clip',
    name: 'OptiMedia Audio Benchmark.mp4',
    type: 'video',
    description: '1080p video with 128k audio track (preserves MP4/WebM)',
    format: 'MP4',
  },
];

/**
 * Fallback synthesizer for high-detail image test pattern if disk image is unreachable
 */
function createSyntheticTestImage(name: string, isPng: boolean): Promise<File> {
  return new Promise((resolve) => {
    const w = 2560;
    const h = 1440;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Rich dark futuristic gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#020617');
    grad.addColorStop(0.3, '#0f172a');
    grad.addColorStop(0.7, '#1e1b4b');
    grad.addColorStop(1, '#064e3b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Intricate geometric lines and architectural lattices
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 60; i++) {
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)';
      ctx.beginPath();
      ctx.moveTo(i * 45, 0);
      ctx.lineTo(w - i * 30, h);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * 35);
      ctx.lineTo(w, h - i * 25);
      ctx.stroke();
    }

    // High frequency texture dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let x = 40; x < w; x += 60) {
      for (let y = 40; y < h; y += 60) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // Central circular aperture lens render
    const cx = w / 2;
    const cy = h / 2;
    for (let r = 80; r < 400; r += 35) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${r * 0.8 + 140}, 75%, 60%, 0.4)`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // High resolution text watermark
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name.toUpperCase(), cx, cy - 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '32px "JetBrains Mono", monospace';
    ctx.fillText(`${w} × ${h} ${isPng ? 'PNG' : 'JPEG'} 92–95%+ VISUAL QUALITY PATTERN`, cx, cy + 40);

    const mime = isPng ? 'image/png' : 'image/jpeg';
    canvas.toBlob((blob) => {
      resolve(new File([blob!], name, { type: mime }));
    }, mime, 0.95);
  });
}

export async function loadSampleFile(sample: SampleMediaDefinition): Promise<File> {
  if (sample.type === 'video') {
    return generateSampleVideoBlob();
  }

  const isPng = sample.format === 'PNG' || sample.name.toLowerCase().endsWith('.png');

  if (sample.url && !isPng) {
    try {
      const response = await fetch(sample.url);
      if (response.ok) {
        const blob = await response.blob();
        return new File([blob], sample.name, { type: blob.type || 'image/jpeg' });
      }
    } catch {
      // Fall through to synthetic
    }
  }

  return createSyntheticTestImage(sample.name, isPng);
}
