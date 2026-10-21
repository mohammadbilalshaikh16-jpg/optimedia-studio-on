/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MediaItem,
  ImageSettings,
  VideoSettings,
} from './types/optimizer';
import { DEFAULT_IMAGE_SETTINGS, DEFAULT_VIDEO_SETTINGS } from './utils/presets';
import { getImageDimensions, optimizeImage, detectImageFormat } from './utils/imageOptimizer';
import {
  getVideoMetadata,
  optimizeVideo,
  detectVideoFormat,
  getOrCreateAudioContext,
  MAX_VIDEO_SIZE_BYTES,
  MAX_VIDEO_SIZE_ERROR,
} from './utils/videoOptimizer';
import { SAMPLE_MEDIAS, loadSampleFile } from './utils/samples';
import { createZipBlob } from './utils/zip';
import { TopBar, NavTab } from './components/TopBar';
import { DropZone } from './components/DropZone';
import { MediaTable } from './components/MediaTable';
import { VisualInspector } from './components/VisualInspector';
import { BatchActionBar } from './components/BatchActionBar';
import { EngineDocs } from './components/EngineDocs';
import { Footer } from './components/Footer';
import { AboutPage } from './components/pages/AboutPage';
import { PrivacyPage } from './components/pages/PrivacyPage';
import { ContactPage } from './components/pages/ContactPage';
import { TermsPage } from './components/pages/TermsPage';
import { FaqPage } from './components/pages/FaqPage';
import { GuidesPage } from './components/pages/GuidesPage';
import {
  UploadCloud,
  Zap,
  Download,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  FolderArchive,
  Sparkles,
  Cpu,
} from 'lucide-react';
import { formatBytes } from './utils/formatters';

// Smart auto-compression settings targeting 92–95%+ visual quality while preserving original formats
const SMART_AUTO_IMAGE_SETTINGS: ImageSettings = {
  ...DEFAULT_IMAGE_SETTINGS,
  format: 'original', // Preserve JPG->JPG, PNG->PNG, WebP->WebP
  quality: 93, // 92-95%+ visual quality target
  resizeMode: 'none', // Preserve native resolution
  stripMetadata: false, // Preserve important color profile metadata
  grayscale: false,
  sharpen: false,
};

const SMART_AUTO_VIDEO_SETTINGS: VideoSettings = {
  ...DEFAULT_VIDEO_SETTINGS,
  format: 'original', // Preserve MP4->MP4, WebM->WebM
  resolution: 'original', // Preserve native resolution
  fps: 30, // Preserve FPS
  videoBitrateKbps: 0, // 0 = Auto adaptive rate control targeting 23–25% reduction (75–77% of original size)
  audioOption: 'compress', // Preserve audio track with 128 kbps Opus/AAC
  audioBitrateKbps: 128,
  trimEnabled: false,
};

function getOptimizedFileExtension(item: MediaItem): string {
  if (item.type === 'video') {
    const blobType = (item.optimizedBlob?.type || '').toLowerCase();
    if (blobType.includes('mp4')) return 'mp4';
    if (blobType.includes('webm')) return 'webm';
    if (blobType.includes('quicktime') || blobType.includes('mov')) return 'mov';

    const optFmt = (item.optimizedFormat || '').toLowerCase();
    if (optFmt.includes('webm')) return 'webm';
    if (optFmt.includes('mp4') || optFmt.includes('h264') || optFmt.includes('avc')) return 'mp4';
    if (optFmt.includes('mov') || optFmt.includes('quicktime')) return 'mov';

    const extMatch = item.name.match(/\.([a-zA-Z0-9]+)$/);
    if (extMatch) {
      const origExt = extMatch[1].toLowerCase();
      if (['mp4', 'm4v', 'mov', 'webm'].includes(origExt)) {
        return origExt === 'm4v' ? 'mp4' : origExt;
      }
    }

    return 'mp4';
  } else {
    const blobType = (item.optimizedBlob?.type || '').toLowerCase();
    if (blobType.includes('png')) return 'png';
    if (blobType.includes('jpeg') || blobType.includes('jpg')) return 'jpg';
    if (blobType.includes('avif')) return 'avif';
    if (blobType.includes('webp')) return 'webp';

    const optFmt = (item.optimizedFormat || item.originalFormat || '').toLowerCase();
    if (optFmt.includes('png')) return 'png';
    if (optFmt.includes('jpg') || optFmt.includes('jpeg')) return 'jpg';
    if (optFmt.includes('avif')) return 'avif';
    if (optFmt.includes('webp')) return 'webp';

    return 'jpg';
  }
}

export default function App() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [inspectingItem, setInspectingItem] = useState<MediaItem | null>(null);

  const [activeTab, setActiveTab] = useState<NavTab>('workspace');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const activeCancelSignals = useRef<Map<string, { cancelled: boolean }>>(new Map());

  // Sync active page with URL hash for clean deep-linking & back button navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      const validTabs: NavTab[] = [
        'workspace',
        'inspector',
        'docs',
        'about',
        'privacy',
        'contact',
        'terms',
        'faq',
        'guides',
      ];
      if (validTabs.includes(hash as NavTab)) {
        setActiveTab(hash as NavTab);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigateTab = (tab: NavTab) => {
    setActiveTab(tab);
    window.location.hash = tab === 'workspace' ? '' : `#${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamically resolve active inspecting item to always have the latest progress/blob state
  const activeInspectingItem = inspectingItem
    ? items.find((i) => i.id === inspectingItem.id) || inspectingItem
    : (activeTab === 'inspector' && items.length > 0 ? items[0] : null);

  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  // Add files to queue
  const handleAddFiles = async (files: File[]) => {
    const newItems: MediaItem[] = [];

    for (const file of files) {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|m4v|flv|wmv|ts|mts|3gp|vob|ogv|qt|m2ts)$/i.test(file.name);
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|gif|bmp|heic|heif|svg)$/i.test(file.name);

      if (!isImage && !isVideo) continue;

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      let originalUrl = '';
      try {
        originalUrl = URL.createObjectURL(file);
      } catch {
        // Fallback for edge cases
      }

      if (isVideo) {
        // Hard maximum 10 GB video limit check
        if (file.size > MAX_VIDEO_SIZE_BYTES) {
          setFileSizeError(MAX_VIDEO_SIZE_ERROR);
          newItems.push({
            id,
            file,
            type: 'video',
            name: file.name,
            originalSize: file.size,
            originalWidth: 1920,
            originalHeight: 1080,
            originalDuration: 0,
            originalFormat: 'MP4',
            originalUrl,
            status: 'error',
            error: MAX_VIDEO_SIZE_ERROR,
            progress: 0,
          });
          continue;
        }

        let meta = { width: 1920, height: 1080, duration: 0, formatName: 'MP4', extension: 'mp4' };
        try {
          meta = await getVideoMetadata(file, file.name);
        } catch (err) {
          console.warn('Metadata parsing fallback for video:', err);
          const detected = detectVideoFormat(file, file.name);
          meta = { width: 1920, height: 1080, duration: 0, formatName: detected.formatName, extension: detected.extension };
        }

        newItems.push({
          id,
          file,
          type: 'video',
          name: file.name,
          originalSize: file.size,
          originalWidth: meta.width,
          originalHeight: meta.height,
          originalDuration: meta.duration,
          originalFormat: meta.formatName,
          originalUrl,
          status: 'idle',
          progress: 0,
        });
      } else {
        let meta = { width: 1920, height: 1080 };
        let detected = { formatName: 'JPG', extension: 'jpg' };
        try {
          meta = await getImageDimensions(file);
          detected = detectImageFormat(file);
        } catch (err) {
          console.warn('Metadata parsing fallback for image:', err);
        }

        newItems.push({
          id,
          file,
          type: 'image',
          name: file.name,
          originalSize: file.size,
          originalWidth: meta.width,
          originalHeight: meta.height,
          originalFormat: detected.formatName,
          originalUrl,
          status: 'idle',
          progress: 0,
        });
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      setActiveTab('workspace');
    }
  };

  // Clipboard paste support
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        handleAddFiles(Array.from(e.clipboardData.files));
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Quick sample loader
  const handleLoadSamples = async () => {
    try {
      const loaded: File[] = [];
      for (const sample of SAMPLE_MEDIAS) {
        const f = await loadSampleFile(sample);
        loaded.push(f);
      }
      await handleAddFiles(loaded);
    } catch (err) {
      console.error('Error loading sample media', err);
    }
  };

  // Optimize a single media item with smart defaults
  const processItem = async (item: MediaItem) => {
    // Awaken shared audio graph during user click interaction
    getOrCreateAudioContext();

    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'processing', progress: 5 } : i))
    );

    try {
      if (item.type === 'image') {
        const result = await optimizeImage(item.file, SMART_AUTO_IMAGE_SETTINGS, (prog) => {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, progress: prog } : i))
          );
        });

        const optimizedUrl = URL.createObjectURL(result.blob);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: 'done',
                  progress: 100,
                  optimizedBlob: result.blob,
                  optimizedUrl,
                  optimizedSize: result.blob.size,
                  optimizedWidth: result.width,
                  optimizedHeight: result.height,
                  optimizedFormat: result.formatName,
                  psnr: result.psnr,
                  processingTimeMs: result.durationMs,
                }
              : i
          )
        );
      } else {
        if (item.file.size > MAX_VIDEO_SIZE_BYTES) {
          throw new Error(MAX_VIDEO_SIZE_ERROR);
        }

        const cancelSignal = { cancelled: false };
        activeCancelSignals.current.set(item.id, cancelSignal);

        try {
          const result = await optimizeVideo(
            item.file,
            SMART_AUTO_VIDEO_SETTINGS,
            (prog, meta) => {
              setItems((prev) =>
                prev.map((i) =>
                  i.id === item.id
                    ? {
                        ...i,
                        progress: prog,
                        etaSeconds: meta?.etaSeconds,
                        speed: meta?.speed,
                      }
                    : i
                )
              );
            },
            cancelSignal
          );

          const optimizedUrl = URL.createObjectURL(result.blob);
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    status: 'done',
                    progress: 100,
                    etaSeconds: undefined,
                    speed: undefined,
                    isRemux: result.isRemux,
                    keptOriginal: result.keptOriginal,
                    isLarger: result.isLarger,
                    warning: result.warning,
                    actualReductionPercent: result.actualReductionPercent,
                    rawCompressedBlob: result.rawCompressedBlob,
                    rawCompressedSize: result.rawCompressedSize,
                    optimizedBlob: result.blob,
                    optimizedUrl,
                    optimizedSize: result.blob.size,
                    optimizedWidth: result.width,
                    optimizedHeight: result.height,
                    optimizedDuration: result.duration,
                    optimizedFormat: result.formatName,
                    processingTimeMs: result.durationMs,
                    jobId: result.jobId,
                    ssim: result.ssim,
                    psnr: result.psnr,
                  }
                : i
            )
          );
        } finally {
          activeCancelSignals.current.delete(item.id);
        }
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Compression failed';
      if (errMsg.toLowerCase().includes('cancelled')) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'idle', progress: 0, etaSeconds: undefined, speed: undefined }
              : i
          )
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: 'error', error: errMsg, progress: 0 }
            : i
        )
      );
    }
  };

  const handleCancelItem = (item: MediaItem) => {
    const signal = activeCancelSignals.current.get(item.id);
    if (signal) {
      signal.cancelled = true;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: 'idle',
              progress: 0,
              etaSeconds: undefined,
              speed: undefined,
            }
          : i
      )
    );
  };

  // Optimize all pending items with conservative sequential video processing
  const handleProcessAll = async () => {
    getOrCreateAudioContext();
    setIsProcessingBatch(true);
    const pendingItems = items.filter((i) => i.status === 'idle' || i.status === 'error');

    // Separate images (parallel execution) and videos (sequential hardware encoding)
    const imageItems = pendingItems.filter((i) => i.type === 'image');
    const videoItems = pendingItems.filter((i) => i.type === 'video');

    // Process images in parallel with a concurrency pool of 3
    const CONCURRENCY_LIMIT = 3;
    let nextImageIndex = 0;

    const worker = async () => {
      while (nextImageIndex < imageItems.length) {
        const item = imageItems[nextImageIndex++];
        if (item) {
          await processItem(item);
        }
      }
    };

    const workers = Array.from(
      { length: Math.min(CONCURRENCY_LIMIT, imageItems.length) },
      () => worker()
    );

    await Promise.all(workers);

    // Process videos sequentially
    for (const item of videoItems) {
      await processItem(item);
    }

    setIsProcessingBatch(false);
  };

  // Single download with preserved original file format
  const handleDownload = (item: MediaItem) => {
    if (!item.optimizedBlob) return;
    const ext = getOptimizedFileExtension(item);
    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const filename = `${baseName}_optimized.${ext}`;

    const url = URL.createObjectURL(item.optimizedBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Keep ObjectURL alive for 60 seconds so browser can finish writing the file asynchronously
    setTimeout(() => {
      try {
        if (a.parentNode) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      } catch {}
    }, 60000);
  };

  // Download all as ZIP with preserved original file formats
  const handleDownloadAllZip = async () => {
    const completed = items.filter((i) => i.status === 'done' && i.optimizedBlob);
    if (completed.length === 0) return;

    const filesToZip: { name: string; data: Uint8Array }[] = [];
    for (const item of completed) {
      if (!item.optimizedBlob) continue;
      const ext = getOptimizedFileExtension(item);
      const baseName = item.name.replace(/\.[^/.]+$/, '');
      const arrayBuffer = await item.optimizedBlob.arrayBuffer();
      filesToZip.push({
        name: `${baseName}_optimized.${ext}`,
        data: new Uint8Array(arrayBuffer),
      });
    }

    const zipBlob = await createZipBlob(filesToZip);
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `Optimized_Media_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      try {
        if (a.parentNode) {
          document.body.removeChild(a);
        }
        URL.revokeObjectURL(url);
      } catch {}
    }, 60000);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.originalUrl);
        if (target.optimizedUrl) URL.revokeObjectURL(target.optimizedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
    setSelectedItemIds((prev) => prev.filter((i) => i !== id));
    if (inspectingItem?.id === id) setInspectingItem(null);
  };

  const handleClearQueue = () => {
    items.forEach((item) => {
      URL.revokeObjectURL(item.originalUrl);
      if (item.optimizedUrl) URL.revokeObjectURL(item.optimizedUrl);
    });
    setItems([]);
    setSelectedItemIds([]);
    setInspectingItem(null);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const filtered = items.filter((i) => filterType === 'all' || i.type === filterType);
    if (filtered.every((i) => selectedItemIds.includes(i.id))) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filtered.map((i) => i.id));
    }
  };

  const totalSavedBytes = items
    .filter((i) => i.status === 'done' && i.optimizedSize !== undefined)
    .reduce((acc, i) => acc + Math.max(0, i.originalSize - (i.optimizedSize || 0)), 0);

  const pendingItemsCount = items.filter((i) => i.status === 'idle' || i.status === 'error').length;
  const completedItemsCount = items.filter((i) => i.status === 'done' && i.optimizedSize !== undefined).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Hidden file input for header trigger */}
      <input
        ref={hiddenFileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v,.flv,.wmv,.ts,.mts,.3gp,.vob,.ogv,.qt,.webp,.png,.jpeg,.jpg,.avif,.gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleAddFiles(Array.from(e.target.files));
            e.target.value = '';
          }
        }}
      />

      {/* Top Bar */}
      <TopBar
        onLoadSamples={handleLoadSamples}
        onAddFilesClick={() => hiddenFileInputRef.current?.click()}
        activeTab={activeTab}
        setActiveTab={handleNavigateTab}
        totalSavedBytes={totalSavedBytes}
        totalFiles={items.length}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 pb-20">
        {activeTab === 'about' ? (
          <AboutPage
            onBackToOptimizer={() => handleNavigateTab('workspace')}
            onNavigateTo={(p) => handleNavigateTab(p as NavTab)}
          />
        ) : activeTab === 'privacy' ? (
          <PrivacyPage
            onBackToOptimizer={() => handleNavigateTab('workspace')}
            onNavigateTo={(p) => handleNavigateTab(p as NavTab)}
          />
        ) : activeTab === 'contact' ? (
          <ContactPage
            onBackToOptimizer={() => handleNavigateTab('workspace')}
            onNavigateTo={(p) => handleNavigateTab(p as NavTab)}
          />
        ) : activeTab === 'terms' ? (
          <TermsPage
            onBackToOptimizer={() => handleNavigateTab('workspace')}
            onNavigateTo={(p) => handleNavigateTab(p as NavTab)}
          />
        ) : activeTab === 'faq' ? (
          <FaqPage
            onBackToOptimizer={() => handleNavigateTab('workspace')}
            onNavigateTo={(p) => handleNavigateTab(p as NavTab)}
          />
        ) : activeTab === 'guides' ? (
          <GuidesPage
            onBackToOptimizer={() => handleNavigateTab('workspace')}
            onNavigateTo={(p) => handleNavigateTab(p as NavTab)}
          />
        ) : activeTab === 'docs' ? (
          <EngineDocs />
        ) : activeTab === 'inspector' ? (
          activeInspectingItem ? (
            <div className="py-2">
              <VisualInspector
                item={activeInspectingItem}
                onClose={() => setActiveTab('workspace')}
                onDownload={handleDownload}
                onReprocess={processItem}
                allQueueItems={items}
                onSelectInspectItem={(it) => setInspectingItem(it)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/40 my-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                <FolderArchive className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold text-neutral-100">No media in queue to preview</h3>
              <p className="text-xs text-neutral-400 max-w-sm mt-1 mb-5 leading-relaxed">
                Add videos or images to the workspace to preview them in high fidelity and inspect 23% compression.
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLoadSamples}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-700 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>Load Sample Media</span>
                </button>
                <button
                  type="button"
                  onClick={() => hiddenFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors shadow-sm"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Add Media Files</span>
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="space-y-6">
            {/* Clean 3-Step Flow Indicator */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Media Optimizer</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    92–95%+ Quality · Format Preserving
                  </span>
                </h1>
                <p className="text-xs text-neutral-400 mt-1">
                  Preserves original formats (MP4→MP4, WebM→WebM, JPG→JPG, PNG→PNG), resolution, and synchronized 128 kbps audio.
                </p>
              </div>

              {/* 3 Steps Pipeline Breadcrumb */}
              <div className="hidden md:flex items-center gap-2 text-xs font-medium">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                    items.length === 0
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>1. Upload</span>
                </div>

                <ArrowRight className="h-3.5 w-3.5 text-neutral-600" />

                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                    pendingItemsCount > 0
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>2. Optimize</span>
                </div>

                <ArrowRight className="h-3.5 w-3.5 text-neutral-600" />

                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${
                    completedItemsCount > 0
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>3. Download</span>
                </div>
              </div>
            </div>

            {/* File size error banner */}
            {fileSizeError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="font-medium">{fileSizeError}</span>
                </div>
                <button
                  onClick={() => setFileSizeError(null)}
                  className="text-xs font-mono text-red-400 hover:text-red-200 underline ml-4 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Performance Notice */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-neutral-300 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-amber-300">
                <Cpu className="h-4 w-4 shrink-0 text-amber-400" />
                <span className="font-bold">Performance Notice</span>
              </div>
              <p className="text-neutral-300 leading-relaxed text-[11px] sm:text-xs">
                Optimization speed depends on your device's hardware specifications. Computers with faster processors, sufficient RAM, and better hardware capabilities may complete optimization faster. Larger videos and lower-power devices may require more time.
              </p>
            </div>

            {/* Step 1: Upload Drop Zone */}
            <DropZone onFilesSelected={handleAddFiles} />

            {/* Quick Action Banner when items exist */}
            {items.length > 0 && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {completedItemsCount === items.length ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Zap className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-100">
                      {completedItemsCount === items.length
                        ? 'All files optimized and ready to download!'
                        : `${pendingItemsCount} ${pendingItemsCount === 1 ? 'file' : 'files'} ready for optimization`}
                    </h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      {completedItemsCount > 0 ? (
                        <>
                          Saved <span className="text-emerald-400 font-semibold">{formatBytes(totalSavedBytes)}</span> · Formats & 128k audio preserved
                        </>
                      ) : (
                        'Auto-preserves format (MP4/WebM/JPG/PNG) · Native resolution & synchronized 128k audio'
                      )}
                    </p>
                  </div>
                </div>

                {/* Primary Button: Optimize or Download All */}
                <div className="flex items-center gap-2">
                  {pendingItemsCount > 0 && (
                    <button
                      type="button"
                      onClick={handleProcessAll}
                      disabled={isProcessingBatch}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/40 disabled:opacity-50"
                    >
                      <Zap className="h-4 w-4 fill-current" />
                      <span>{isProcessingBatch ? 'Optimizing...' : `Optimize All (${pendingItemsCount})`}</span>
                    </button>
                  )}

                  {completedItemsCount > 0 && (
                    <button
                      type="button"
                      onClick={handleDownloadAllZip}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-950/40"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download All ({completedItemsCount})</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Media Queue Table */}
            {items.length > 0 && (
              <MediaTable
                items={items}
                selectedItemIds={selectedItemIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onInspect={(item) => {
                  setInspectingItem(item);
                }}
                onDownload={handleDownload}
                onRemove={handleRemoveItem}
                onReprocess={processItem}
                onCancel={handleCancelItem}
                filterType={filterType}
                setFilterType={setFilterType}
              />
            )}
          </div>
        )}
      </main>

      {/* Universal Footer with links to all AdSense review & policy pages */}
      <Footer onNavigateTo={(p) => handleNavigateTab(p as NavTab)} activePage={activeTab} />

      {/* Modal Visual Inspector if inspecting directly */}
      {inspectingItem && activeTab !== 'inspector' && activeInspectingItem && (
        <VisualInspector
          item={activeInspectingItem}
          onClose={() => setInspectingItem(null)}
          onDownload={handleDownload}
          onReprocess={processItem}
          allQueueItems={items}
          onSelectInspectItem={(it) => setInspectingItem(it)}
        />
      )}

      {/* Floating Batch Action Summary Bar */}
      {activeTab === 'workspace' && (
        <BatchActionBar
          items={items}
          isProcessingAny={isProcessingBatch}
          onProcessAll={handleProcessAll}
          onDownloadAllZip={handleDownloadAllZip}
          onClearQueue={handleClearQueue}
        />
      )}

    </div>
  );
}
