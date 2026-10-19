import React from 'react';
import { Sparkles, UploadCloud, FolderArchive } from 'lucide-react';

export type NavTab = 'workspace' | 'inspector' | 'docs' | 'about' | 'privacy' | 'contact' | 'terms' | 'faq' | 'guides';

interface TopBarProps {
  onLoadSamples: () => void;
  onAddFilesClick: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  totalSavedBytes: number;
  totalFiles: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  onLoadSamples,
  onAddFilesClick,
  activeTab,
  setActiveTab,
  totalSavedBytes,
  totalFiles,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('workspace');
            }}
            className="flex items-center gap-2 text-base font-semibold tracking-tight text-white hover:text-emerald-400 transition-colors"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FolderArchive className="h-4 w-4" />
            </span>
            <span>OptiMedia Studio</span>
          </a>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-neutral-400">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'workspace' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Batch Optimizer
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'inspector' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Visual Inspector
          </button>
          <button
            onClick={() => setActiveTab('guides')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'guides' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Guides & Tutorials
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'faq' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            FAQ & Help
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`transition-colors hover:text-white cursor-pointer ${
              activeTab === 'docs' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Specs
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLoadSamples}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
            title="Load sample high-res photo and 1080p benchmark video"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Load Samples</span>
          </button>

          <button
            onClick={onAddFilesClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-medium text-neutral-950 hover:bg-emerald-400 transition-colors shadow-sm shadow-emerald-950 cursor-pointer"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Add Media</span>
          </button>
        </div>
      </div>
    </header>
  );
};
