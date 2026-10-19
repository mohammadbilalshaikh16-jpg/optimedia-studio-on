import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Video as VideoIcon, Sparkles, Loader2 } from 'lucide-react';
import { SAMPLE_MEDIAS, SampleMediaDefinition, loadSampleFile } from '../utils/samples';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoadingSample?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [loadingSampleId, setLoadingSampleId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleSelectSample = async (sample: SampleMediaDefinition) => {
    try {
      setLoadingSampleId(sample.id);
      const file = await loadSampleFile(sample);
      onFilesSelected([file]);
    } catch (err) {
      console.error('Failed to load sample:', err);
    } finally {
      setLoadingSampleId(null);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border border-dashed transition-all duration-200 px-6 py-9 text-center ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-500/5'
            : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.mp4,.webm,.mov,.mkv,.avi,.m4v,.flv,.wmv,.ts,.mts,.3gp,.vob,.ogv,.qt,.webp,.avif,.jpeg,.jpg,.png,.gif,.bmp"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800/80 text-emerald-400 mb-4 border border-neutral-700/50">
          <Upload className="h-6 w-6" />
        </div>

        <h3 className="text-base font-semibold text-neutral-100">
          Drop images or videos here, or <span className="text-emerald-400 hover:underline">browse</span>
        </h3>

        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <span>MP4</span>
          <span aria-hidden="true">·</span>
          <span>WebM</span>
          <span aria-hidden="true">·</span>
          <span>JPG</span>
          <span aria-hidden="true">·</span>
          <span>PNG</span>
          <span aria-hidden="true">·</span>
          <span>WebP</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400/90 font-medium">Format Preserving (MP4→MP4, JPG→JPG, PNG→PNG)</span>
          <span aria-hidden="true">·</span>
          <span>128k Audio Synced</span>
          <span aria-hidden="true">·</span>
          <span className="text-neutral-300 font-mono">Max 10 GB Video</span>
        </div>
      </div>

      {/* Quick sample pickers */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-neutral-400">
        <span className="flex items-center gap-1.5 font-medium text-neutral-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Quick Test Bench:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_MEDIAS.map((sample) => {
            const isLoading = loadingSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin text-emerald-400" />
                ) : sample.type === 'video' ? (
                  <VideoIcon className="h-3 w-3 text-sky-400" />
                ) : (
                  <ImageIcon className="h-3 w-3 text-emerald-400" />
                )}
                <span>{sample.name.split('.')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
