import React, { useState, useRef, useEffect } from 'react';
import { MediaItem } from '../types/optimizer';
import { formatBytes, formatDuration, calculateSavings } from '../utils/formatters';
import {
  X,
  Download,
  Split,
  Columns,
  Flame,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Camera,
  Volume2,
  VolumeX,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface VisualInspectorProps {
  item: MediaItem;
  onClose: () => void;
  onDownload: (item: MediaItem) => void;
  onReprocess?: (item: MediaItem) => void;
  allQueueItems?: MediaItem[];
  onSelectInspectItem?: (item: MediaItem) => void;
}

export const VisualInspector: React.FC<VisualInspectorProps> = ({
  item,
  onClose,
  onDownload,
  onReprocess,
  allQueueItems,
  onSelectInspectItem,
}) => {
  const hasOptimized = !!(item.optimizedBlob || item.optimizedUrl);

  const [viewMode, setViewMode] = useState<'split' | 'sideBySide' | 'difference'>('split');
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0-100
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Video playback & sync controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const origVideoRef = useRef<HTMLVideoElement>(null);
  const optVideoRef = useRef<HTMLVideoElement>(null);
  const singleVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const diffCanvasRef = useRef<HTMLCanvasElement>(null);

  const savings = item.optimizedSize
    ? calculateSavings(item.originalSize, item.optimizedSize)
    : null;

  // Handle Split slider dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingSlider(true);
    updateSliderPosition(e.clientX);
  };

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.round((x / rect.width) * 100);
    setSplitPos(percent);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingSlider) {
        updateSliderPosition(e.clientX);
      }
    };
    const handlePointerUp = () => {
      setIsDraggingSlider(false);
    };

    if (isDraggingSlider) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingSlider]);

  // Render Difference Heatmap for images
  useEffect(() => {
    if (viewMode !== 'difference' || item.type !== 'image' || !diffCanvasRef.current || !hasOptimized) return;

    const canvas = diffCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgA = new Image();
    const imgB = new Image();
    imgA.crossOrigin = 'anonymous';
    imgB.crossOrigin = 'anonymous';

    let loaded = 0;
    const onBothLoaded = () => {
      loaded++;
      if (loaded < 2) return;

      const w = 500;
      const h = Math.round((imgA.height / imgA.width) * 500) || 300;
      canvas.width = w;
      canvas.height = h;

      const cA = document.createElement('canvas');
      cA.width = w;
      cA.height = h;
      const ctxA = cA.getContext('2d')!;
      ctxA.drawImage(imgA, 0, 0, w, h);
      const dataA = ctxA.getImageData(0, 0, w, h);

      const cB = document.createElement('canvas');
      cB.width = w;
      cB.height = h;
      const ctxB = cB.getContext('2d')!;
      ctxB.drawImage(imgB, 0, 0, w, h);
      const dataB = ctxB.getImageData(0, 0, w, h);

      const diff = ctx.createImageData(w, h);
      const dA = dataA.data;
      const dB = dataB.data;
      const dOut = diff.data;

      for (let i = 0; i < dA.length; i += 4) {
        // Compute delta amplified by 8x for visible heatmap
        const dr = Math.abs(dA[i] - dB[i]) * 8;
        const dg = Math.abs(dA[i + 1] - dB[i + 1]) * 8;
        const db = Math.abs(dA[i + 2] - dB[i + 2]) * 8;
        const val = Math.min(255, (dr + dg + db) / 3);

        // Heatmap color: black -> purple -> red -> yellow
        dOut[i] = Math.min(255, val * 1.5);
        dOut[i + 1] = Math.max(0, val - 100);
        dOut[i + 2] = Math.max(0, 150 - val);
        dOut[i + 3] = 255;
      }

      ctx.putImageData(diff, 0, 0);
    };

    imgA.onload = onBothLoaded;
    imgB.onload = onBothLoaded;
    imgA.src = item.originalUrl;
    imgB.src = item.optimizedUrl || item.originalUrl;
  }, [viewMode, item, hasOptimized]);

  // Safe URL resolution for original and optimized video streams
  const [origVideoUrl, setOrigVideoUrl] = useState<string>(() => {
    return item.originalUrl || (item.file ? URL.createObjectURL(item.file) : '');
  });

  const [optVideoUrl, setOptVideoUrl] = useState<string>(() => {
    if (item.optimizedUrl) return item.optimizedUrl;
    if (item.optimizedBlob) return URL.createObjectURL(item.optimizedBlob);
    if (item.jobId) return `/api/download/${item.jobId}?inline=true`;
    return '';
  });

  const [origLoadError, setOrigLoadError] = useState<string | null>(null);
  const [optLoadError, setOptLoadError] = useState<string | null>(null);
  const [useNativeControls, setUseNativeControls] = useState<boolean>(false);

  useEffect(() => {
    const oUrl = item.originalUrl || (item.file ? URL.createObjectURL(item.file) : '');
    setOrigVideoUrl(oUrl);

    let optUrl = item.optimizedUrl;
    if (!optUrl && item.optimizedBlob) {
      optUrl = URL.createObjectURL(item.optimizedBlob);
    }
    if (!optUrl && item.jobId) {
      optUrl = `/api/download/${item.jobId}?inline=true`;
    }
    setOptVideoUrl(optUrl || '');
    setOrigLoadError(null);
    setOptLoadError(null);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [item.id, item.optimizedUrl, item.optimizedBlob, item.status, item.jobId]);

  // Video Synchronizer with safe playback handling
  const togglePlay = async () => {
    if (isPlaying) {
      try {
        if (!hasOptimized) {
          singleVideoRef.current?.pause();
        } else {
          origVideoRef.current?.pause();
          optVideoRef.current?.pause();
        }
      } catch {}
      setIsPlaying(false);
    } else {
      try {
        if (!hasOptimized) {
          if (singleVideoRef.current) {
            await singleVideoRef.current.play();
            setIsPlaying(true);
          }
        } else {
          const promises: Promise<void>[] = [];
          if (origVideoRef.current) {
            origVideoRef.current.currentTime = currentTime;
            promises.push(origVideoRef.current.play().catch(() => {}));
          }
          if (optVideoRef.current) {
            optVideoRef.current.currentTime = currentTime;
            promises.push(optVideoRef.current.play().catch(() => {}));
          }
          await Promise.all(promises);
          setIsPlaying(true);
        }
      } catch {}
    }
  };

  const handleTimeUpdate = () => {
    const v = !hasOptimized
      ? singleVideoRef.current
      : (optVideoRef.current || origVideoRef.current);
    if (v) {
      setCurrentTime(v.currentTime);
      if (v.duration && !isNaN(v.duration)) {
        setDuration(v.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    setCurrentTime(t);
    if (!hasOptimized) {
      if (singleVideoRef.current) singleVideoRef.current.currentTime = t;
    } else {
      if (origVideoRef.current) origVideoRef.current.currentTime = t;
      if (optVideoRef.current) optVideoRef.current.currentTime = t;
    }
  };

  // Extract poster frame from current video position
  const handleExtractPoster = () => {
    const video = !hasOptimized
      ? singleVideoRef.current
      : (optVideoRef.current || origVideoRef.current);
    if (!video || !video.videoWidth || !video.videoHeight) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.name.replace(/\.[^/.]+$/, '')}_poster_frame.png`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        try {
          if (a.parentNode) document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch {}
      }, 60000);
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6">
      <div className="relative flex flex-col w-full max-w-6xl h-[92vh] rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3.5 bg-neutral-900/70">
          <div className="flex items-center gap-3 min-w-0">
            {/* Multiple items switcher dropdown if available */}
            {allQueueItems && allQueueItems.length > 1 && onSelectInspectItem ? (
              <select
                value={item.id}
                onChange={(e) => {
                  const target = allQueueItems.find((q) => q.id === e.target.value);
                  if (target) onSelectInspectItem(target);
                }}
                className="bg-neutral-800 text-neutral-100 text-xs rounded-lg px-2.5 py-1.5 border border-neutral-700 font-sans max-w-[200px] truncate"
              >
                {allQueueItems.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({q.status === 'done' ? 'Optimized' : 'Source'})
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-semibold text-neutral-100 text-sm truncate max-w-xs" title={item.name}>
                {item.name}
              </span>
            )}

            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <span>{item.originalWidth}×{item.originalHeight}</span>
              {hasOptimized && (
                <>
                  <span>→</span>
                  <span className="text-emerald-400 font-semibold">
                    {item.optimizedWidth || item.originalWidth}×{item.optimizedHeight || item.originalHeight}
                  </span>
                </>
              )}
              {savings && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-medium">
                    -{savings.percentageSaved.toFixed(1)}% ({formatBytes(savings.bytesSaved)} saved)
                  </span>
                </>
              )}
              {!hasOptimized && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-sans text-[11px] px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    Source Preview
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Mode switch & Action buttons */}
          <div className="flex items-center gap-2">
            {item.type === 'image' && hasOptimized && (
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                    viewMode === 'split' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Split Slider Comparison"
                >
                  <Split className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Split Curtain</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('sideBySide')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                    viewMode === 'sideBySide' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Side-by-Side View"
                >
                  <Columns className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Side-by-Side</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('difference')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                    viewMode === 'difference' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Amplified Artifact Heatmap"
                >
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Artifact Delta</span>
                </button>
              </div>
            )}

            {/* Zoom controls for images */}
            {item.type === 'image' && (
              <div className="hidden sm:flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  className="p-1 text-neutral-400 hover:text-white rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-neutral-300 w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                  className="p-1 text-neutral-400 hover:text-white rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1 text-neutral-400 hover:text-white rounded"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Optimize Now button if unoptimized */}
            {!hasOptimized && onReprocess && (item.status === 'idle' || item.status === 'error') && (
              <button
                type="button"
                onClick={() => onReprocess(item)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors shadow-sm"
              >
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Optimize (~23% reduction)</span>
              </button>
            )}

            {/* Export button if already optimized */}
            {hasOptimized && (
              <button
                type="button"
                onClick={() => onDownload(item)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-neutral-950 hover:bg-emerald-400 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title="Close Preview (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Comparison Canvas */}
        <div className="relative flex-1 bg-neutral-950 overflow-hidden flex items-center justify-center p-4">
          {/* IMAGE INSPECTOR */}
          {item.type === 'image' && (
            <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
              {!hasOptimized ? (
                /* Unoptimized Single Image Preview */
                <div
                  className="relative max-w-full max-h-full flex flex-col items-center justify-center p-2"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.15s ease-out',
                  }}
                >
                  <img
                    src={item.originalUrl}
                    alt={item.name}
                    className="max-h-[66vh] max-w-full object-contain rounded-lg border border-neutral-800 shadow-xl"
                  />
                  <div className="mt-3 text-xs font-mono text-neutral-400">
                    {item.originalFormat?.toUpperCase()} · {item.originalWidth}×{item.originalHeight} · {formatBytes(item.originalSize)}
                  </div>
                </div>
              ) : viewMode === 'split' ? (
                /* Split Curtain Comparison */
                <div
                  ref={containerRef}
                  className="relative max-w-full max-h-full aspect-auto rounded-lg overflow-hidden border border-neutral-800 shadow-xl cursor-ew-resize"
                  onPointerDown={handlePointerDown}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                    transition: isDraggingSlider ? 'none' : 'transform 0.15s ease-out',
                  }}
                >
                  {/* Optimized (Background / Right Side) */}
                  <img
                    src={item.optimizedUrl || item.originalUrl}
                    alt="Optimized"
                    className="max-h-[68vh] max-w-full object-contain block pointer-events-none"
                    draggable={false}
                  />

                  {/* Original (Clipped Left Side) */}
                  <div
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ width: `${splitPos}%` }}
                  >
                    <img
                      src={item.originalUrl}
                      alt="Original"
                      className="max-h-[68vh] max-w-none object-contain block"
                      style={{
                        width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                        height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%',
                      }}
                      draggable={false}
                    />
                  </div>

                  {/* Vertical Dividing Line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 pointer-events-none"
                    style={{ left: `${splitPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-neutral-950 shadow-lg border border-emerald-300">
                      <Split className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur px-2.5 py-1 rounded text-[11px] font-mono text-neutral-200 border border-neutral-800 pointer-events-none">
                    Original ({formatBytes(item.originalSize)})
                  </div>
                  <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur px-2.5 py-1 rounded text-[11px] font-mono text-emerald-400 border border-neutral-800 pointer-events-none">
                    Optimized ({formatBytes(item.optimizedSize || item.originalSize)})
                  </div>
                </div>
              ) : viewMode === 'sideBySide' ? (
                /* Side-by-Side Comparison */
                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full max-h-[72vh] items-center"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                  }}
                >
                  <div className="relative flex flex-col items-center justify-center h-full rounded-lg border border-neutral-800 bg-neutral-900/40 p-2 overflow-hidden">
                    <img
                      src={item.originalUrl}
                      alt="Original"
                      className="max-h-[60vh] max-w-full object-contain"
                    />
                    <div className="mt-2 text-xs font-mono text-neutral-300">
                      Original: {formatBytes(item.originalSize)} ({item.originalWidth}×{item.originalHeight})
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center justify-center h-full rounded-lg border border-neutral-800 bg-neutral-900/40 p-2 overflow-hidden">
                    <img
                      src={item.optimizedUrl || item.originalUrl}
                      alt="Optimized"
                      className="max-h-[60vh] max-w-full object-contain"
                    />
                    <div className="mt-2 text-xs font-mono text-emerald-400">
                      Optimized: {formatBytes(item.optimizedSize || 0)} ({item.optimizedWidth || item.originalWidth}×{item.optimizedHeight || item.originalHeight})
                    </div>
                  </div>
                </div>
              ) : (
                /* Difference Map */
                <div className="flex flex-col items-center justify-center h-full max-h-[70vh]">
                  <canvas ref={diffCanvasRef} className="max-h-[60vh] max-w-full rounded-lg border border-neutral-800 shadow-xl" />
                  <p className="mt-3 text-xs text-neutral-400 font-sans">
                    Difference Map (Amplified 8×): Dark regions indicate zero difference. Bright purple/yellow areas show compression changes.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* VIDEO INSPECTOR */}
          {item.type === 'video' && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              {!hasOptimized ? (
                /* UNOPTIMIZED SOURCE VIDEO PREVIEW PLAYER */
                <div className="flex flex-col items-center justify-center w-full max-w-4xl h-full max-h-[72vh]">
                  <div className="relative flex flex-col items-center justify-center w-full flex-1 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-3 overflow-hidden group">
                    {origLoadError ? (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-xs text-neutral-400 max-w-md">
                        <AlertTriangle className="h-8 w-8 text-amber-400 mb-2" />
                        <p className="text-amber-400 font-semibold mb-1 text-sm">Browser Native Decoder Warning</p>
                        <p className="text-xs mb-4 text-neutral-300">{origLoadError}</p>
                        <div className="flex items-center gap-3">
                          {onReprocess && (
                            <button
                              type="button"
                              onClick={() => onReprocess(item)}
                              className="px-4 py-2 rounded-lg bg-emerald-500 text-neutral-950 font-semibold hover:bg-emerald-400 text-xs flex items-center gap-1.5 shadow"
                            >
                              <Zap className="h-3.5 w-3.5 fill-current" />
                              <span>Optimize Video to MP4</span>
                            </button>
                          )}
                          <a
                            href={origVideoUrl}
                            download={item.name}
                            className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-200 hover:bg-neutral-700 text-xs"
                          >
                            Download Source File
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="relative w-full h-full flex items-center justify-center cursor-pointer"
                        onClick={togglePlay}
                      >
                        <video
                          ref={singleVideoRef}
                          src={origVideoUrl}
                          className="max-h-[58vh] max-w-full rounded-xl object-contain shadow-2xl"
                          playsInline
                          preload="metadata"
                          muted={isMuted}
                          controls={useNativeControls}
                          onTimeUpdate={handleTimeUpdate}
                          onEnded={() => setIsPlaying(false)}
                          onError={() =>
                            setOrigLoadError(
                              'This specific codec or container format cannot be decoded natively by your browser. Running optimization will transcode it to a universal CFR MP4 format.'
                            )
                          }
                        />
                        {!isPlaying && !useNativeControls && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/40 transition-colors">
                            <div className="h-14 w-14 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                              <Play className="h-7 w-7 ml-1 fill-current" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Video Transport Bar */}
                  <div className="w-full max-w-3xl mt-4 px-4 py-3 rounded-xl border border-neutral-800 bg-neutral-900/90 flex items-center gap-3.5">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition-colors shadow"
                      title={isPlaying ? 'Pause Video' : 'Play Video'}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5 fill-current" />}
                    </button>

                    <span className="text-xs font-mono text-neutral-300 tabular-nums">
                      {formatDuration(currentTime)} / {formatDuration(duration || item.originalDuration || 0)}
                    </span>

                    <input
                      type="range"
                      min="0"
                      max={duration || item.originalDuration || 1}
                      step="0.05"
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const next = !isMuted;
                        setIsMuted(next);
                        if (singleVideoRef.current) singleVideoRef.current.muted = next;
                      }}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                        !isMuted
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                      title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    >
                      {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUseNativeControls((prev) => !prev)}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${
                        useNativeControls
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                      title="Toggle Native Player Controls"
                    >
                      <Sliders className="h-3 w-3" />
                      <span className="hidden sm:inline">{useNativeControls ? 'Native UI' : 'Custom UI'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExtractPoster}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors"
                      title="Extract Current Frame as PNG"
                    >
                      <Camera className="h-3.5 w-3.5 text-sky-400" />
                      <span className="hidden sm:inline">Frame PNG</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* OPTIMIZED DUAL SYNCHRONIZED COMPARISON PLAYER */
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full flex-1 max-h-[64vh] items-center">
                    {/* Original Video */}
                    <div className="relative flex flex-col items-center justify-center h-full rounded-xl border border-neutral-800 bg-neutral-900/50 p-2 overflow-hidden group">
                      {origLoadError ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-neutral-400">
                          <p className="text-amber-400 font-medium mb-1">Source Video Preview Unavailable</p>
                          <p className="text-[11px] mb-3">{origLoadError}</p>
                          <a
                            href={origVideoUrl}
                            download={item.name}
                            className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-200 hover:bg-neutral-700 text-xs"
                          >
                            Download Source File
                          </a>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center cursor-pointer" onClick={togglePlay}>
                          <video
                            ref={origVideoRef}
                            src={origVideoUrl}
                            className="max-h-[52vh] max-w-full rounded-lg object-contain"
                            playsInline
                            preload="metadata"
                            muted
                            controls={useNativeControls}
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={() => setIsPlaying(false)}
                            onError={() => setOrigLoadError('Video format or codec cannot be decoded natively by this browser.')}
                          />
                          {!isPlaying && !useNativeControls && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                              <div className="h-12 w-12 rounded-full bg-emerald-500/90 text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Play className="h-6 w-6 ml-0.5 fill-current" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-2 text-xs font-mono text-neutral-300">
                        Source: {formatBytes(item.originalSize)} ({item.originalWidth}×{item.originalHeight})
                      </div>
                    </div>

                    {/* Optimized Video */}
                    <div className="relative flex flex-col items-center justify-center h-full rounded-xl border border-neutral-800 bg-neutral-900/50 p-2 overflow-hidden group">
                      {optLoadError ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-neutral-400">
                          <p className="text-amber-400 font-medium mb-1">Optimized Video Preview Unavailable</p>
                          <p className="text-[11px] mb-3">{optLoadError}</p>
                          <button
                            type="button"
                            onClick={() => onDownload(item)}
                            className="px-3 py-1.5 rounded bg-emerald-500 text-neutral-950 hover:bg-emerald-400 font-medium text-xs"
                          >
                            Download Optimized Video
                          </button>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center cursor-pointer" onClick={togglePlay}>
                          <video
                            ref={optVideoRef}
                            src={optVideoUrl}
                            className="max-h-[52vh] max-w-full rounded-lg object-contain"
                            playsInline
                            preload="metadata"
                            muted={isMuted}
                            controls={useNativeControls}
                            onEnded={() => setIsPlaying(false)}
                            onError={() => setOptLoadError('Optimized video cannot be decoded natively by this browser. Download to play.')}
                          />
                          {!isPlaying && !useNativeControls && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                              <div className="h-12 w-12 rounded-full bg-emerald-500/90 text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <Play className="h-6 w-6 ml-0.5 fill-current" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-2 text-xs font-mono text-emerald-400">
                        Optimized: {formatBytes(item.optimizedSize || item.originalSize)} ({item.optimizedWidth || item.originalWidth}×{item.optimizedHeight || item.originalHeight})
                      </div>
                    </div>
                  </div>

                  {/* Synchronized Video Transport Bar */}
                  <div className="w-full max-w-2xl mt-4 px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900/80 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition-colors"
                      title={isPlaying ? 'Pause Videos' : 'Play Both Videos in Sync'}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5 fill-current" />}
                    </button>

                    <span className="text-xs font-mono text-neutral-300 tabular-nums">
                      {formatDuration(currentTime)} / {formatDuration(duration || item.originalDuration || 0)}
                    </span>

                    <input
                      type="range"
                      min="0"
                      max={duration || item.originalDuration || 1}
                      step="0.05"
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const next = !isMuted;
                        setIsMuted(next);
                        if (optVideoRef.current) {
                          optVideoRef.current.muted = next;
                        }
                      }}
                      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs transition-colors ${
                        !isMuted
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                      title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                    >
                      {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio On'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUseNativeControls((prev) => !prev)}
                      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs transition-colors ${
                        useNativeControls
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                      title="Toggle Browser Native Video Controls"
                    >
                      <span className="hidden sm:inline">{useNativeControls ? 'Native Controls' : 'Custom Controls'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExtractPoster}
                      className="inline-flex items-center gap-1 rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-700 transition-colors"
                      title="Extract current frame as PNG"
                    >
                      <Camera className="h-3.5 w-3.5 text-sky-400" />
                      <span className="hidden sm:inline">Frame PNG</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="border-t border-neutral-800 px-5 py-2.5 bg-neutral-900/50 flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                {item.type === 'image'
                  ? 'Format Preserving · Auto-Quantization & Chroma Subsampling'
                  : 'Two-Pass Macroblock-Tree Rate Control · Preserves Resolution & FPS'}
              </span>
            </span>
            {item.psnr ? (
              <span>
                Fidelity: <span className="text-emerald-400 font-bold">{item.psnr.toFixed(1)} dB PSNR</span>
                {item.ssim ? <span className="text-emerald-400 font-bold ml-1">· SSIM {item.ssim.toFixed(4)}</span> : null} (Perceptually Lossless)
              </span>
            ) : null}
          </div>
          <div>
            {!hasOptimized
              ? 'Click "Optimize" to run rate-controlled compression (~23% reduction).'
              : 'Synchronized dual stream inspection verifies sharp edges, color fidelity, and audio sync.'}
          </div>
        </div>
      </div>
    </div>
  );
};
