import React from 'react';
import { MediaItem } from '../types/optimizer';
import { formatBytes, formatDuration, calculateSavings } from '../utils/formatters';
import {
  Download,
  Trash2,
  Eye,
  Zap,
  Video as VideoIcon,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X,
  AlertTriangle,
} from 'lucide-react';

interface MediaTableProps {
  items: MediaItem[];
  selectedItemIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onInspect: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
  onRemove: (id: string) => void;
  onReprocess: (item: MediaItem) => void;
  onCancel?: (item: MediaItem) => void;
  filterType: 'all' | 'image' | 'video';
  setFilterType: (type: 'all' | 'image' | 'video') => void;
}

export const MediaTable: React.FC<MediaTableProps> = ({
  items,
  selectedItemIds,
  onToggleSelect,
  onSelectAll,
  onInspect,
  onDownload,
  onRemove,
  onReprocess,
  onCancel,
  filterType,
  setFilterType,
}) => {
  const filteredItems = items.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const allSelected = filteredItems.length > 0 && filteredItems.every((i) => selectedItemIds.includes(i.id));

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
      {/* Header controls & filter tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-200">Files Queue</span>
          <span className="text-xs font-mono text-neutral-400">
            ({filteredItems.length} {filteredItems.length === 1 ? 'file' : 'files'})
          </span>
        </div>

        {/* Filter buttons - Zero-pill segmented control */}
        <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800/80">
          {(['all', 'image', 'video'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                filterType === tab
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab === 'all' ? 'All Files' : `${tab}s`}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="py-12 text-center text-neutral-400">
          <p className="text-sm">No files in queue matching filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/40 text-neutral-400 font-medium">
                <th className="py-2.5 px-4 w-8">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onSelectAll}
                    className="rounded border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-0"
                  />
                </th>
                <th className="py-2.5 px-3">File</th>
                <th className="py-2.5 px-3">Original</th>
                <th className="py-2.5 px-3">Optimized</th>
                <th className="py-2.5 px-3">Savings</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {filteredItems.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                const hasOptimized = item.status === 'done' && item.optimizedSize !== undefined;
                const savings = hasOptimized
                  ? calculateSavings(item.originalSize, item.optimizedSize!)
                  : null;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-neutral-800/30 transition-colors ${
                      isSelected ? 'bg-neutral-800/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(item.id)}
                        className="rounded border-neutral-700 bg-neutral-800 text-emerald-500 focus:ring-0"
                      />
                    </td>

                    {/* Thumbnail & File Name */}
                    <td className="py-3.5 px-3">
                      <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => onInspect(item)}
                        title="Click to preview"
                      >
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                          {item.type === 'image' ? (
                            <img
                              src={item.optimizedUrl || item.originalUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="relative h-full w-full flex items-center justify-center bg-neutral-900">
                              <video
                                src={item.optimizedUrl || item.originalUrl}
                                className="h-full w-full object-cover opacity-60"
                                muted
                                playsInline
                              />
                              <VideoIcon className="absolute h-4 w-4 text-sky-400 group-hover:scale-110 transition-transform" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 max-w-sm font-sans">
                          <p className="truncate font-medium text-neutral-100 text-xs group-hover:text-emerald-400 transition-colors" title={item.name}>
                            {item.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-0.5 font-mono">
                            <span className="uppercase text-neutral-300 font-semibold">{item.originalFormat || item.type}</span>
                            <span aria-hidden="true">·</span>
                            <span>{item.originalWidth}×{item.originalHeight}</span>
                            {item.originalDuration ? (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{formatDuration(item.originalDuration)}</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-emerald-400">Audio Synced</span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Original Size */}
                    <td className="py-3.5 px-3 text-neutral-300 tabular-nums">
                      {formatBytes(item.originalSize)}
                    </td>

                    {/* Optimized Size or Progress */}
                    <td className="py-3.5 px-3">
                      {item.status === 'processing' ? (
                        <div className="w-32 space-y-1">
                          <div className="flex justify-between text-[11px] text-neutral-400">
                            <span>{item.etaSeconds && item.etaSeconds > 0 ? `ETA ~${item.etaSeconds}s` : 'Compressing'}</span>
                            <span className="text-emerald-400 font-mono">{item.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-150"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          {item.speed && (
                            <div className="text-[10px] text-neutral-500 font-mono text-right">
                              {item.speed} speed
                            </div>
                          )}
                        </div>
                      ) : item.status === 'done' && item.optimizedSize !== undefined ? (
                        <div>
                          {item.isLarger || (item.keptOriginal && item.warning) ? (
                            <div title={item.warning || 'Original file preserved to ensure complete playback'}>
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-neutral-100 tabular-nums">
                                  {formatBytes(item.optimizedSize)}
                                </span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                                  Original Kept
                                </span>
                              </div>
                              <div className="text-[10px] text-amber-400/90 mt-0.5 font-mono flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 shrink-0" />
                                <span>{item.rawCompressedSize ? `Raw was ${formatBytes(item.rawCompressedSize)}` : 'Stream verified'}</span>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="font-semibold text-neutral-100 tabular-nums">
                                {formatBytes(item.optimizedSize)}
                              </span>
                              <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                                {item.type === 'video' ? (
                                  <span className="flex items-center gap-1 text-emerald-400">
                                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                                    <span>
                                      {item.psnr ? (
                                        <>
                                          <span className="font-semibold">{item.psnr.toFixed(1)} dB PSNR</span>
                                          {item.ssim ? ` · SSIM ${item.ssim.toFixed(4)}` : ''}
                                        </>
                                      ) : item.keptOriginal || (item.optimizedSize !== undefined && item.optimizedSize >= item.originalSize)
                                        ? `${item.optimizedFormat || 'Video'} · Original Kept`
                                        : item.isRemux
                                        ? `${item.optimizedFormat || 'Video'} · Stream-Copy`
                                        : `${item.optimizedFormat || 'Video'} · 23% Compressed`}
                                    </span>
                                  </span>
                                ) : (
                                  <span>
                                    {item.psnr ? `${item.psnr.toFixed(1)} dB PSNR` : (item.optimizedFormat || item.originalFormat || 'Image')}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : item.status === 'error' ? (
                        <div className="space-y-0.5" title={item.error || 'Optimization failed'}>
                          <span className="text-rose-400 flex items-center gap-1 text-[11px] font-medium">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            <span>Failed</span>
                          </span>
                          {item.error && (
                            <p className="text-[10px] text-rose-400/80 font-mono truncate max-w-[140px]">
                              {item.error}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-400 font-sans">Ready</span>
                      )}
                    </td>

                    {/* Net Savings */}
                    <td className="py-3.5 px-3">
                      {hasOptimized ? (
                        item.isLarger || (item.keptOriginal && item.warning) ? (
                          <div className="space-y-0.5" title={item.warning}>
                            <div className="flex items-center gap-1 text-amber-400 font-semibold text-xs tabular-nums">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                              <span>Original Kept</span>
                            </div>
                            <div className="text-[11px] text-neutral-400 tabular-nums">
                              Could not compress
                            </div>
                          </div>
                        ) : savings && savings.bytesSaved > 0 ? (
                          <div>
                            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold tabular-nums">
                              <span>-{savings.percentageSaved.toFixed(1)}%</span>
                            </div>
                            <div className="text-[11px] text-neutral-400 tabular-nums">
                              Saved {formatBytes(savings.bytesSaved)}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-1.5 text-amber-400 font-medium tabular-nums">
                              <span>Unchanged</span>
                            </div>
                            <div className="text-[11px] text-neutral-400 tabular-nums">
                              Original kept (Not compressed)
                            </div>
                          </div>
                        )
                      ) : item.status === 'processing' ? (
                        <span className="text-neutral-400 flex items-center gap-1 text-[11px] font-sans">
                          <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                          <span>Optimizing...</span>
                        </span>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>

                    {/* Actions: Download / Optimize / Inspect / Remove */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="inline-flex items-center gap-2 font-sans">
                        <button
                          type="button"
                          onClick={() => onInspect(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
                          title={hasOptimized ? "Inspect Before/After" : "Preview file"}
                        >
                          <Eye className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="hidden sm:inline">Preview</span>
                        </button>

                        {hasOptimized ? (
                          <button
                            type="button"
                            onClick={() => onDownload(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors shadow-sm"
                            title="Download optimized file"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>Download</span>
                          </button>
                        ) : item.status === 'processing' && onCancel ? (
                          <button
                            type="button"
                            onClick={() => onCancel(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/20 hover:text-rose-200 transition-colors cursor-pointer"
                            title="Cancel optimization"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Cancel</span>
                          </button>
                        ) : item.status === 'idle' || item.status === 'error' ? (
                          <button
                            type="button"
                            onClick={() => onReprocess(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                            title="Optimize this file"
                          >
                            <Zap className="h-3.5 w-3.5 fill-current" />
                            <span>Optimize</span>
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
                          title="Remove file"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
