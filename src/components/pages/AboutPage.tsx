import React from 'react';
import { ArrowLeft, Zap, Shield, Cpu, Video, CheckCircle2, Globe, Heart, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onBackToOptimizer: () => void;
  onNavigateTo: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToOptimizer, onNavigateTo }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Back button & Header */}
      <div>
        <button
          onClick={onBackToOptimizer}
          className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Video Optimizer</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            About OptiMedia Studio
          </span>
          <span className="text-xs text-neutral-400">Founded for creators, developers & video editors</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          High-Fidelity Media Optimization Without Visual Compromise
        </h1>
        <p className="text-base text-neutral-300 max-w-3xl leading-relaxed">
          OptiMedia Studio was engineered to solve a fundamental challenge on the modern web: reducing video and image payload sizes by 23%–50% while preserving original colors, frame rates, and perceptually lossless visual clarity.
        </p>
      </div>

      {/* Mission & Core Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Smart Balanced Rate Control</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Unlike crude blunt compressors that drop resolutions or destroy fine gradients, our pipeline uses multi-threaded rate-controlled encoding calibrated to a balanced 23% reduction target with SSIM metrics exceeding 0.989.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Native Format Preservation</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            We preserve native container formats (MP4 stays MP4, WebM stays WebM, PNG stays PNG) and audio tracks with zero-drift stream copying, ensuring plug-and-play compatibility with your web applications and CMS.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Privacy-First Architecture</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Image compression runs entirely in your local browser sandbox. Videos are processed via temporary disk streaming buffers and purged automatically on completion. We never monetize or train on your media.
          </p>
        </div>
      </div>

      {/* The Story / Behind the Project */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white">Why We Built OptiMedia Studio</h2>
        <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
          <p>
            Large video files account for more than 70% of total bandwidth consumed across the modern internet. Yet, standard optimization tools usually present creators with a frustrating binary: either suffer massive 500 MB upload bottlenecks, or accept heavily compressed video that suffers from blocking, washed-out color grading, and audio synchronization drift.
          </p>
          <p>
            We set out to build an accessible, professional-grade suite that bridges the gap between complex command-line FFmpeg workflows and intuitive browser tools. By integrating real-time visual side-by-side inspection with empirical metric validation (SSIM and PSNR), creators can see exactly what changed before shipping media to users.
          </p>
        </div>

        {/* Feature comparison highlights */}
        <div className="pt-4 border-t border-neutral-800/80">
          <h3 className="text-sm font-semibold text-white mb-4">Key Engineering Highlights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Multi-threaded single-pass VBV and fast 2-pass x264 pipelines</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Lossless audio pass-through with stream copy</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Color primaries preserved (BT.709, sRGB, HDR10 transfer curves)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>High-capacity chunked streaming support up to 10 GB</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Client-side batch image optimization with AVIF and WebP</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Interactive dual-stream visual inspector with split slider</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audiences */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Who Benefits From OptiMedia Studio?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-neutral-800/80 bg-neutral-900/30">
            <div className="text-emerald-400 font-semibold text-sm mb-1">Web Developers & Engineers</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Drastically improve Google Core Web Vitals (LCP), lower Cloudflare and CDN bandwidth egress costs, and accelerate background video load times without re-encoding failures.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-neutral-800/80 bg-neutral-900/30">
            <div className="text-emerald-400 font-semibold text-sm mb-1">Video Creators & Editors</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Quickly downsize high-bitrate ProRes/H.264 camera exports for client approval, social media distribution, and portfolios while preserving punchy contrast and crisp text overlays.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-neutral-800/80 bg-neutral-900/30">
            <div className="text-emerald-400 font-semibold text-sm mb-1">E-Commerce & Digital Agencies</div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Optimize hundreds of product demonstration videos and catalog photos in batch, delivering immediate playback on mobile devices regardless of network conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action & navigation footer */}
      <div className="p-8 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-neutral-900/40 to-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">Ready to optimize your media?</h3>
          <p className="text-xs text-neutral-400">
            Drag and drop videos or photos into the workspace to experience intelligent 23% compression.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onBackToOptimizer}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-semibold hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer"
          >
            Launch Optimizer
          </button>
          <button
            onClick={() => onNavigateTo('guides')}
            className="px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-200 text-xs font-medium hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Read Guides
          </button>
        </div>
      </div>
    </div>
  );
};
