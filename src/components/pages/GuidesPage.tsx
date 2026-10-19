import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Video, Cpu, Sliders, CheckCircle2, Copy, Check, ArrowRight, Zap, Code, Shield } from 'lucide-react';

interface GuidesPageProps {
  onBackToOptimizer: () => void;
  onNavigateTo: (page: string) => void;
}

interface GuideArticle {
  id: string;
  title: string;
  tag: string;
  readTime: string;
  summary: string;
  content: React.ReactNode;
}

export const GuidesPage: React.FC<GuidesPageProps> = ({ onBackToOptimizer, onNavigateTo }) => {
  const [activeGuideId, setActiveGuideId] = useState<string>('gop-vbv');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const articles: GuideArticle[] = [
    {
      id: 'gop-vbv',
      tag: 'ARCHITECTURE & BITRATE',
      readTime: '6 min read',
      title: 'The Anatomy of Web Video Compression: Balancing Bitrate, GOP Size & VBV Buffering',
      summary:
        'A comprehensive deep dive into Intra-frames (I-frames), predictive motion estimation, and how Video Buffer Verifier (VBV) constraints prevent cellular playback buffering.',
      content: (
        <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
          <p>
            When video is streamed over the modern web, file size is only half the equation. Delivering smooth playback requires understanding how video codecs structure frames across time and how decoders buffer content under constrained network bandwidth.
          </p>

          <h3 className="text-base font-bold text-white">1. The Frame Hierarchy: I-Frames, P-Frames, and B-Frames</h3>
          <p>
            Modern video compression relies on temporal redundancy—the fact that consecutive frames in a video clip are largely identical, except for moving objects:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-neutral-400">
            <li>
              <strong className="text-neutral-200">I-Frames (Keyframes / Intra-frames):</strong> Complete standalone images compressed like JPEGs. They do not depend on any other frames to be decoded, but they require the most data (often 5x–10x larger than predictive frames).
            </li>
            <li>
              <strong className="text-neutral-200">P-Frames (Predicted frames):</strong> Only encode changes relative to previous frames using motion vectors. They achieve significant compression efficiency.
            </li>
            <li>
              <strong className="text-neutral-200">B-Frames (Bidirectional frames):</strong> Reference both preceding and succeeding frames for maximum compression efficiency.
            </li>
          </ul>

          <h3 className="text-base font-bold text-white">2. Calibrating GOP (Group of Pictures) Length</h3>
          <p>
            The GOP size determines the distance between keyframes. A common mistake in web video encoding is setting arbitrary keyframe intervals of 10 or 15 seconds. While this saves a marginal amount of data, it ruins user experience: users seeking or scrubbing forward on a mobile device experience noticeable latency because the video player must wait for the next keyframe.
          </p>
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="text-xs font-mono text-emerald-400 font-semibold">Recommended Web GOP Configuration:</div>
            <div className="text-xs text-neutral-400">
              For 30 FPS video, set <code className="text-neutral-200 font-mono">-g 30 -keyint_min 15</code> (exactly 1 keyframe every 1.0 to 1.5 seconds). This guarantees sub-second seeking response without bloating the video container with redundant I-frames.
            </div>
          </div>

          <h3 className="text-base font-bold text-white">3. Video Buffer Verifier (VBV) Constraints</h3>
          <p>
            Constant Bitrate (CBR) wastes bandwidth on simple scenes, while unrestricted Variable Bitrate (VBR) can produce spikes that overwhelm 4G/5G mobile cellular connections, causing the dreaded spinning loader.
          </p>
          <p>
            Constrained ABR with VBV constraints (<code className="text-neutral-200 font-mono">-maxrate</code> and <code className="text-neutral-200 font-mono">-bufsize</code>) solves this dilemma: it allows the encoder to raise bitrate dynamically during complex motion scenes, but caps the peak transmission rate so browser decoders never empty their playback cache.
          </p>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-400">Production Constrained VBV Command Template</span>
              <button
                onClick={() =>
                  handleCopyCode(
                    'ffmpeg -i input.mp4 -c:v libx264 -preset veryfast -b:v 3800k -maxrate 4800k -bufsize 6000k -movflags +faststart -c:a copy output.mp4',
                    'vbv-cmd'
                  )
                }
                className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer"
              >
                {copiedCode === 'vbv-cmd' ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCode === 'vbv-cmd' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-emerald-300 bg-neutral-950 p-3 rounded-lg overflow-x-auto">
              ffmpeg -i input.mp4 -c:v libx264 -preset veryfast -b:v 3800k -maxrate 4800k -bufsize 6000k -movflags +faststart -c:a copy output.mp4
            </pre>
          </div>
        </div>
      ),
    },
    {
      id: 'ssim-psnr',
      tag: 'FIDELITY & METRICS',
      readTime: '5 min read',
      title: 'Measuring Real Perceptual Fidelity: SSIM vs PSNR Explained',
      summary:
        'Why file size alone is a misleading metric, how Structural Similarity indexes capture human perception, and how to verify perceptual quality before deployment.',
      content: (
        <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
          <p>
            When optimizing media, anyone can reduce a 100 MB video to 10 MB if they do not care about quality. The real engineering discipline lies in achieving the mathematical sweet spot where payload is reduced by 23%–30% while the visual output remains indistinguishable from the master source.
          </p>

          <h3 className="text-base font-bold text-white">1. Why File Size Alone Is Insufficient</h3>
          <p>
            A high-contrast scene with moving water, confetti, or film grain naturally requires more bitrate than an interview shot in front of a flat grey background. Judging optimization purely by percentage reduction often penalizes complex footage or allows simple footage to remain bloated. Empirical quality metrics provide the ground truth.
          </p>

          <h3 className="text-base font-bold text-white">2. Structural Similarity Index (SSIM)</h3>
          <p>
            Developed by researchers at NYU and UT Austin, SSIM was designed specifically because classical mathematical comparisons (like MSE) do not mirror human visual perception. SSIM computes three distinct components:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-emerald-400 font-semibold text-xs">Luminance (l)</div>
              <p className="text-[11px] text-neutral-400">Compares overall brightness balance between images.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-emerald-400 font-semibold text-xs">Contrast (c)</div>
              <p className="text-[11px] text-neutral-400">Evaluates standard deviation and dynamic range preservation.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-emerald-400 font-semibold text-xs">Structure (s)</div>
              <p className="text-[11px] text-neutral-400">Detects pixel correlation, texture edges, and geometric clarity.</p>
            </div>
          </div>
          <p>
            SSIM is scored on a decimal scale up to 1.0. In production video streaming:
          </p>
          <ul className="space-y-1 pl-5 list-disc text-neutral-400 text-xs">
            <li><strong className="text-neutral-200">0.985 – 0.995+:</strong> Perceptually lossless. The human eye cannot detect compression differences at normal viewing distances.</li>
            <li><strong className="text-neutral-200">0.950 – 0.980:</strong> Minor edge softening visible only during still frame comparisons.</li>
            <li><strong className="text-neutral-200">&lt; 0.920:</strong> Evident blockiness, mosquito noise, and blurring around fast-moving edges.</li>
          </ul>

          <h3 className="text-base font-bold text-white">3. Peak Signal-to-Noise Ratio (PSNR)</h3>
          <p>
            PSNR evaluates the ratio between the maximum possible pixel power and the corrupting mean squared error (MSE) across all color channels. It is measured in decibels (dB):
          </p>
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="text-xs font-mono text-emerald-400">Benchmark Reading Guide:</div>
            <p className="text-xs text-neutral-400">
              For 8-bit and 10-bit video, values above <strong className="text-white">38 dB</strong> are considered excellent broadcast quality. Values above <strong className="text-white">42 dB</strong> represent near-original fidelity.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'audio-copy',
      tag: 'STREAM INTEGRITY',
      readTime: '4 min read',
      title: 'Zero-Drift Audio: The Importance of Stream Copying (-c:a copy)',
      summary:
        'Why amateur video tools introduce audio desynchronization over long playback sessions and how stream copying ensures zero-drift synchronization.',
      content: (
        <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
          <p>
            Few technical bugs ruin a video faster than audio desynchronization—where a speaker’s lips move half a second before their voice is heard. This phenomenon, known as audio drift, plagues many naive web compressors.
          </p>

          <h3 className="text-base font-bold text-white">1. The Cause of Audio Drift in Web Re-encoding</h3>
          <p>
            When video transcoding utilities indiscriminately transcode both video and audio, several issues arise:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-neutral-400 text-xs">
            <li>
              <strong className="text-neutral-200">Sample Rate Conversion:</strong> Converting 48,000 Hz audio to 44,100 Hz requires fractional resampling. If timestamp rounding errors accumulate across 20,000 video frames, drift progressively widens.
            </li>
            <li>
              <strong className="text-neutral-200">Encoder Padding & Priming Delay:</strong> Lossy audio encoders (like AAC) add silence priming samples at the start of an audio track to prime their transform filters. Without precise edit list metadata, this introduces an initial 20–50 ms offset.
            </li>
            <li>
              <strong className="text-neutral-200">Variable Frame Rate (VFR) Discrepancies:</strong> Smartphone recordings often fluctuate between 28 FPS and 31 FPS based on thermal throttling. Re-encoding audio against variable video timestamps creates desynchronization.
            </li>
          </ul>

          <h3 className="text-base font-bold text-white">2. The Solution: Stream Copying (-c:a copy)</h3>
          <p>
            Because modern video uploads almost universally contain standard AAC, Opus, or MP3 audio at 128–256 kbps, re-encoding the audio track saves very little bandwidth (audio typically comprises less than 3%–5% of the total file size).
          </p>
          <p>
            OptiMedia Studio inspects the incoming audio stream and, whenever compatible, applies <code className="text-neutral-200 font-mono">-c:a copy</code>. The audio packets are demuxed from the input and remuxed into the output container bit-for-bit without decompression, preserving original acoustic fidelity and guaranteeing 0.00 ms drift.
          </p>
        </div>
      ),
    },
    {
      id: 'codec-battle',
      tag: 'COMPATIBILITY',
      readTime: '7 min read',
      title: 'Web Video Codec Showdown: H.264 (AVC) vs WebM (VP9) vs AV1',
      summary:
        'Hardware decoder support across iOS, Android, and Desktop, battery power implications, and choosing the optimal format for your audience.',
      content: (
        <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
          <p>
            Choosing a video codec for web distribution involves balancing three competing priorities: compression efficiency, hardware decoding availability, and encoding speed.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400">
                  <th className="py-2.5 pr-4 font-semibold">Codec / Container</th>
                  <th className="py-2.5 px-4 font-semibold">Hardware Support</th>
                  <th className="py-2.5 px-4 font-semibold">Efficiency vs H.264</th>
                  <th className="py-2.5 pl-4 font-semibold">Recommended Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                <tr>
                  <td className="py-3 pr-4 font-mono font-medium text-white">H.264 / MP4</td>
                  <td className="py-3 px-4 text-emerald-400">99.8% (Universal)</td>
                  <td className="py-3 px-4">Baseline (1.0x)</td>
                  <td className="py-3 pl-4">Universal web playback, older mobile devices, maximum compatibility.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono font-medium text-white">VP9 / WebM</td>
                  <td className="py-3 px-4 text-emerald-400">96.5% (Chrome, Android, Edge, Safari 14+)</td>
                  <td className="py-3 px-4 text-emerald-400">~20%–30% higher</td>
                  <td className="py-3 pl-4">Modern browser delivery, YouTube-style web video embeds, transparent videos.</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono font-medium text-white">AV1 / MP4</td>
                  <td className="py-3 px-4 text-amber-400">~72% (Modern GPUs & flagship phones)</td>
                  <td className="py-3 px-4 text-emerald-400">~35%–45% higher</td>
                  <td className="py-3 pl-4">Next-gen high-volume platforms (Netflix, YouTube) with multi-format fallback.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-bold text-white">Why Format Preservation Matters</h3>
          <p>
            Converting every incoming video to WebM can break playback on legacy smart TVs or email clients, while converting all WebM files to MP4 can increase file sizes unnecessarily. OptiMedia Studio respects your original format choice: when you supply an MP4, our engine outputs an optimized MP4; when you supply a WebM, it outputs an optimized WebM.
          </p>
        </div>
      ),
    },
    {
      id: 'faststart-web',
      tag: 'TUTORIAL & SEO',
      readTime: '5 min read',
      title: 'Step-by-Step: Optimizing Background Hero Videos for Core Web Vitals',
      summary:
        'How to optimize full-screen landing page videos to pass Google Core Web Vitals (LCP) and eliminate mobile buffering.',
      content: (
        <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
          <p>
            Background hero videos create immersive visual experiences on modern landing pages, but unoptimized videos frequently ruin Largest Contentful Paint (LCP) scores and degrade search engine rankings.
          </p>

          <h3 className="text-base font-bold text-white">Step 1: Relocate the `moov` Atom with Faststart</h3>
          <p>
            In standard MP4 video containers created by editing software, index metadata (the `moov` atom) is stored at the end of the file. As a result, the browser cannot begin rendering the video until it has downloaded the entire file from start to finish!
          </p>
          <p>
            Enabling <code className="text-emerald-400 font-mono">-movflags +faststart</code> shifts the index headers to the very beginning of the MP4 file. The browser can start progressive playback after downloading just the first 64 KB of data. OptiMedia Studio applies faststart automatically on every optimized output.
          </p>

          <h3 className="text-base font-bold text-white">Step 2: Strip Audio from Background Hero Clips</h3>
          <p>
            Background videos in web hero sections are muted by default. If your video will never play sound, stripping the audio track saves an immediate 128 kbps to 256 kbps of bandwidth across the entire video duration.
          </p>

          <h3 className="text-base font-bold text-white">Step 3: HTML5 Video Embedding Best Practice</h3>
          <p>
            Always include <code className="text-neutral-200 font-mono">playsinline</code>, <code className="text-neutral-200 font-mono">muted</code>, and a poster image so the browser renders an initial frame before video packets stream in:
          </p>
          <pre className="text-xs font-mono text-emerald-300 bg-neutral-950 p-4 rounded-xl overflow-x-auto border border-neutral-800">
{`<video
  autoplay
  loop
  muted
  playsinline
  preload="metadata"
  poster="/hero-poster.webp"
  class="w-full h-full object-cover"
>
  <source src="/hero-video.mp4" type="video/mp4" />
</video>`}
          </pre>
        </div>
      ),
    },
  ];

  const activeArticle = articles.find((a) => a.id === activeGuideId) || articles[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Back button & Header */}
      <div>
        <button
          onClick={onBackToOptimizer}
          className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Video Optimizer</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 mb-2">
          <BookOpen className="h-4 w-4" />
          <span>ORIGINAL TECHNICAL GUIDES & TUTORIALS</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Video Optimization Guides & Tutorials
        </h1>
        <p className="text-sm text-neutral-300 max-w-3xl leading-relaxed">
          Comprehensive, original tutorials covering modern video compression science, bitrate allocation, perceptual quality verification, and web performance optimization.
        </p>
      </div>

      {/* Guide selector layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation: Article Table of Contents */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1 mb-2">
            Table of Contents
          </div>
          {articles.map((art) => {
            const isActive = art.id === activeGuideId;
            return (
              <button
                key={art.id}
                onClick={() => setActiveGuideId(art.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-500/50 bg-emerald-950/20 shadow-sm'
                    : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[10px] font-mono mb-1">
                  <span className={isActive ? 'text-emerald-400 font-semibold' : 'text-neutral-500'}>
                    {art.tag}
                  </span>
                  <span className="text-neutral-500">{art.readTime}</span>
                </div>
                <div className={`text-xs font-semibold line-clamp-2 ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                  {art.title}
                </div>
              </button>
            );
          })}

          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 space-y-2 mt-4">
            <div className="flex items-center gap-2 text-white font-medium">
              <Zap className="h-4 w-4 text-emerald-400" />
              <span>Try In Practice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Experience these rate-control principles live on your files using OptiMedia Studio.
            </p>
            <button
              onClick={onBackToOptimizer}
              className="w-full mt-1 py-2 px-3 rounded-lg bg-emerald-500 text-neutral-950 text-xs font-semibold hover:bg-emerald-400 transition-colors text-center cursor-pointer"
            >
              Open Optimizer
            </button>
          </div>
        </div>

        {/* Right Content: Active Article Reader */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <span>{activeArticle.tag}</span>
              <span>·</span>
              <span className="text-neutral-500">{activeArticle.readTime}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
              {activeArticle.title}
            </h2>
            <p className="text-xs text-neutral-400 italic border-l-2 border-emerald-500/60 pl-3 py-0.5">
              {activeArticle.summary}
            </p>
          </div>

          <div className="border-t border-neutral-800/80 pt-6">
            {activeArticle.content}
          </div>

          <div className="pt-6 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-neutral-400">
              Published by OptiMedia Studio Engineering Team
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTo('faq')}
                className="text-xs text-neutral-300 hover:text-white underline cursor-pointer"
              >
                Browse FAQ
              </button>
              <button
                onClick={onBackToOptimizer}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-semibold hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                <span>Optimize Your Media</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
