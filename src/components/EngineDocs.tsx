import React from 'react';
import { Cpu, Zap, Layers, ShieldCheck, Activity, Film } from 'lucide-react';

export const EngineDocs: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl py-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white">Engine Specifications & Browser Processing Architecture</h2>
        <p className="mt-1 text-sm text-neutral-400">
          OptiMedia Studio runs 100% locally in your browser sandbox using hardware-accelerated Canvas pipelines, native MediaRecorder encoders, and Web Audio API. Zero media data is uploaded to a server.
        </p>
      </div>

      {/* Performance Notice */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-neutral-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-amber-300">
          <Cpu className="h-4 w-4 shrink-0 text-amber-400" />
          <span className="font-bold">Performance Notice</span>
        </div>
        <p className="text-neutral-300 leading-relaxed text-[11px] sm:text-xs">
          Optimization speed depends on your device's hardware specifications. Computers with faster processors, sufficient RAM, and better hardware capabilities may complete optimization faster. Larger videos and lower-power devices may require more time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400">
            <Cpu className="h-4 w-4" />
            <h3 className="text-sm font-semibold text-neutral-100">Image Pipeline (Format Preserving · 92–95%+)</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Preserves your source format by default (JPG→JPG, PNG→PNG, WebP→WebP). Uses 1:1 pixel rendering with high-quality bicubic resampling at 93% quality to strip unneeded bloat while preserving sharp edges, fine textures, and color profiles.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-neutral-400 font-mono">
            <span>JPG (93%)</span> · <span>PNG (Lossless)</span> · <span>WebP (93%)</span> · <span>Native Resolution</span>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-sky-400">
            <Film className="h-4 w-4" />
            <h3 className="text-sm font-semibold text-neutral-100">Video Engine (In-Browser · 23% Reduction Target)</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Processed 100% on your own device using native browser encoders and MediaRecorder. Targets a 23% file size reduction with a calibrated 93–95% visual quality floor. Preserves H.264, H.265, VP9, and AV1 where genuinely supported by your browser hardware.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-neutral-400 font-mono">
            <span>23% Target Rate</span> · <span>Paced CPU/RAM</span> · <span>Audio Passthrough</span> · <span>Native Codecs</span>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldCheck className="h-4 w-4" />
            <h3 className="text-sm font-semibold text-neutral-100">Zero Cloud Uploads & Privacy</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            All encoding is performed strictly in client RAM on your PC or laptop. No images or videos are transmitted over the network. Runs independently without backend servers or paid processing tiers.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-purple-400">
            <Activity className="h-4 w-4" />
            <h3 className="text-sm font-semibold text-neutral-100">PSNR Fidelity Scoring</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Peak Signal-to-Noise Ratio (PSNR in decibels) calculates logarithmic mean squared error between source and compressed pixel grids. Values above 40 dB represent imperceptible visual distortion to human eyes.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-5">
        <h3 className="text-sm font-semibold text-neutral-200 mb-3">Format-Preserving Matrix & Browser Codec Support</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                <th className="py-2 pr-4">Input Media</th>
                <th className="py-2 px-3">Primary Codec</th>
                <th className="py-2 px-3">Genuine Support</th>
                <th className="py-2 pl-3">Target Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono text-neutral-300">
              <tr>
                <td className="py-2.5 pr-4 font-sans text-white">MP4 Video (.mp4)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold">H.264 (AVC) / H.265</td>
                <td className="py-2.5 px-3 text-sky-400">Universal on Chrome, Safari, Edge</td>
                <td className="py-2.5 pl-3 text-emerald-400">~23% Reduction · 93–95% Quality</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-sans text-white">WebM Video (.webm)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold">VP9 / AV1</td>
                <td className="py-2.5 px-3 text-sky-400">Chrome, Edge, Firefox (where supported)</td>
                <td className="py-2.5 pl-3 text-emerald-400">~23% Reduction · 93–95% Quality</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-sans text-white">JPEG Photo (.jpg, .jpeg)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold">JPG / JPEG</td>
                <td className="py-2.5 px-3 text-neutral-400">Universal browser canvas</td>
                <td className="py-2.5 pl-3 text-emerald-400">93% Quality (Sharp)</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-sans text-white">PNG Graphic (.png)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold">PNG</td>
                <td className="py-2.5 px-3 text-neutral-400">Universal browser canvas</td>
                <td className="py-2.5 pl-3 text-emerald-400">100% Lossless</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
