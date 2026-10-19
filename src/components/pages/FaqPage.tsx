import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp, Search, Zap, Shield, Video, Layers, Sparkles } from 'lucide-react';

interface FaqPageProps {
  onBackToOptimizer: () => void;
  onNavigateTo: (page: string) => void;
}

interface FaqItem {
  question: string;
  answer: string;
  category: 'compression' | 'formats' | 'privacy' | 'troubleshooting';
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'compression',
    question: 'How does the 23% compression target work, and why does it look lossless?',
    answer:
      'Unlike arbitrary quality sliders, our engine calculates an exact bitrate budget matching 77% of your original file size (a 23% reduction). By pairing x264 rate-controlled encoding with advanced adaptive quantization (aq-mode=2) and psycho-visual rate-distortion optimization (psy-rd), bits are allocated dynamically to complex motion areas while saving bandwidth on static backgrounds. This achieves an SSIM rating above 0.989, meaning structural degradation is imperceptible during standard 60 Hz playback.',
  },
  {
    category: 'compression',
    question: 'What do the SSIM and PSNR scores mean in the Visual Inspector?',
    answer:
      'SSIM (Structural Similarity Index Measure) evaluates human perception of luminance, contrast, and structure on a scale from 0 to 1. A score of 1.0 represents a bit-identical match. Our pipeline targets an SSIM of 0.985–0.995+, which qualifies as perceptually lossless. PSNR (Peak Signal-to-Noise Ratio) measures pixel-level reconstruction fidelity in decibels (dB), where values above 37–40 dB indicate professional broadcast grade fidelity.',
  },
  {
    category: 'compression',
    question: 'Why doesn’t the optimizer crush my video by 80% like some other tools?',
    answer:
      'Blunt tools that claim 80% compression often downscale 1080p to 480p, drop frame rates from 60 FPS to 24 FPS, or cause heavy macro-blocking and color banding. OptiMedia Studio is designed for creators and web professionals who need guaranteed preservation of native resolution, crisp text overlays, punchy colors, and high frame rates while shaving off crucial bandwidth for web performance.',
  },
  {
    category: 'formats',
    question: 'Which video and image formats are supported?',
    answer:
      'Videos: MP4, WebM, QuickTime MOV, MKV, AVI, M4V, FLV, WMV, and TS streams. Images: JPEG/JPG, PNG, WebP, AVIF, GIF, BMP, HEIC, and SVG. Our system preserves your original container extension so an MP4 remains an MP4 and WebM remains WebM.',
  },
  {
    category: 'formats',
    question: 'How does audio stream copy eliminate synchronization drift?',
    answer:
      'Most online converters re-encode audio into low-bitrate AAC, which can introduce timing offsets (audio drift) and audio artifacts. Whenever your source contains web-standard AAC, MP3, or Opus audio, OptiMedia Studio performs a lossless stream copy (-c:a copy). The original audio packets are remuxed into the output container with zero re-encoding and zero latency drift.',
  },
  {
    category: 'privacy',
    question: 'Are my videos stored on your servers or shared with anyone?',
    answer:
      'No. Image optimization runs 100% locally in your web browser. Video files are streamed in temporary chunks to an isolated processing sandbox strictly for transcoding. Once your optimization is complete or your session ends, the temporary video files and encoding logs are automatically deleted from disk.',
  },
  {
    category: 'formats',
    question: 'What is the maximum file size supported?',
    answer:
      'OptiMedia Studio supports video files up to 10 GB (10,737,418,240 bytes) using an asynchronous sliced 16 MB chunked streaming pipeline. For static images, our browser-based engine handles images up to 100 MB or 40 megapixels.',
  },
  {
    category: 'troubleshooting',
    question: 'What happens if my file is already heavily compressed?',
    answer:
      'If you upload a file that has already been compressed to its mathematical limit, forcing an additional 23% reduction could introduce visual artifacts. Our engine performs automatic safety checks: if re-encoding degrades SSIM below 0.85 or fails decode validation, the system falls back safely to the original file to prevent quality corruption.',
  },
  {
    category: 'troubleshooting',
    question: 'How do I use the Side-by-Side Visual Inspector?',
    answer:
      'Click the "Visual Inspector" tab in the top navigation or click "Inspect" on any media item in your queue. For videos, you can play both the original and optimized video in synchronized lockstep, or drag the interactive split slider to compare pixel-for-pixel detail across fine textures.',
  },
];

export const FaqPage: React.FC<FaqPageProps> = ({ onBackToOptimizer, onNavigateTo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'compression' | 'formats' | 'privacy' | 'troubleshooting'>('all');
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const toggleIndex = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
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
          <HelpCircle className="h-4 w-4" />
          <span>HELP CENTER & DOCUMENTATION</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
          Detailed technical answers regarding rate control, audio synchronization, supported codecs, and privacy guarantees.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="h-4 w-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by topic (e.g., SSIM, audio sync, file size)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'compression', label: 'Compression & Quality' },
            { id: 'formats', label: 'Formats & Audio' },
            { id: 'privacy', label: 'Privacy & Storage' },
            { id: 'troubleshooting', label: 'Troubleshooting' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/30 text-center">
            <p className="text-xs text-neutral-400">
              No matching questions found for "{searchQuery}". Try a different keyword or reach out directly.
            </p>
            <button
              onClick={() => onNavigateTo('contact')}
              className="mt-3 text-xs text-emerald-400 hover:underline font-medium"
            >
              Contact Support
            </button>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-neutral-900/80 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-semibold text-neutral-100">{item.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-neutral-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/60 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still need help banner */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Still have questions?</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Our engineering team is happy to review specific media encoding workflows.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTo('guides')}
            className="px-4 py-2 rounded-lg border border-neutral-700 bg-neutral-800 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Browse Guides
          </button>
          <button
            onClick={() => onNavigateTo('contact')}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 text-xs font-semibold hover:bg-emerald-400 transition-colors cursor-pointer"
          >
            Contact Team
          </button>
        </div>
      </div>
    </div>
  );
};
