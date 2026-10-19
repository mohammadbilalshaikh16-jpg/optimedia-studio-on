import React from 'react';
import { MediaItem } from '../types/optimizer';
import { formatBytes, calculateSavings } from '../utils/formatters';
import { Play, Download, Trash2, CheckCircle2, Loader2, Archive } from 'lucide-react';

interface BatchActionBarProps {
  items: MediaItem[];
  isProcessingAny: boolean;
  onProcessAll: () => void;
  onDownloadAllZip: () => void;
  onClearQueue: () => void;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  items,
  isProcessingAny,
  onProcessAll,
  onDownloadAllZip,
  onClearQueue,
}) => {
  if (items.length === 0) return null;

  const totalOriginalBytes = items.reduce((acc, i) => acc + i.originalSize, 0);
  const completedItems = items.filter((i) => i.status === 'done' && i.optimizedSize !== undefined);
  const totalOptimizedBytes = completedItems.reduce((acc, i) => acc + (i.optimizedSize || 0), 0);
  const completedOriginalBytes = completedItems.reduce((acc, i) => acc + i.originalSize, 0);

  const aggregateSavings = completedItems.length > 0
    ? calculateSavings(completedOriginalBytes, totalOptimizedBytes)
    : null;

  const pendingCount = items.filter((i) => i.status === 'idle' || i.status === 'error').length;

  return (
    <div className="sticky bottom-4 z-30 w-full">
      <div className="mx-auto max-w-7xl rounded-xl border border-neutral-700 bg-neutral-900/95 p-3.5 shadow-2xl backdrop-blur-lg flex flex-wrap items-center justify-between gap-4">
        {/* Statistics Cluster */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-neutral-400 block text-[11px] font-sans">Queue Status</span>
            <span className="text-neutral-200 font-semibold tabular-nums">
              {completedItems.length} / {items.length} Completed
            </span>
          </div>

          <div className="h-6 w-px bg-neutral-800 hidden sm:block" />

          <div>
            <span className="text-neutral-400 block text-[11px] font-sans">Total Size</span>
            <span className="text-neutral-200 tabular-nums">
              {formatBytes(totalOriginalBytes)}
            </span>
          </div>

          {aggregateSavings && aggregateSavings.bytesSaved > 0 && (
            <>
              <div className="h-6 w-px bg-neutral-800 hidden sm:block" />
              <div>
                <span className="text-neutral-400 block text-[11px] font-sans">Net Savings</span>
                <span className="text-emerald-400 font-semibold tabular-nums">
                  -{aggregateSavings.percentageSaved.toFixed(1)}% (Saved {formatBytes(aggregateSavings.bytesSaved)})
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClearQueue}
            disabled={isProcessingAny}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-400 hover:text-rose-400 hover:border-neutral-700 transition-colors disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {completedItems.length > 0 && (
            <button
              type="button"
              onClick={onDownloadAllZip}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              <Archive className="h-3.5 w-3.5" />
              <span>Download ZIP ({completedItems.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onProcessAll}
            disabled={isProcessingAny || pendingCount === 0}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessingAny ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Optimizing...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Optimize Queue ({pendingCount})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
