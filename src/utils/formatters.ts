export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
}

export function calculateSavings(original: number, optimized: number): {
  bytesSaved: number;
  percentageSaved: number;
  ratio: number;
} {
  const bytesSaved = Math.max(0, original - optimized);
  const percentageSaved = original > 0 ? (bytesSaved / original) * 100 : 0;
  const ratio = optimized > 0 ? original / optimized : 1;
  return {
    bytesSaved,
    percentageSaved,
    ratio: Number(ratio.toFixed(1)),
  };
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}
