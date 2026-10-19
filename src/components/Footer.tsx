import React from 'react';
import { FolderArchive, Mail, Shield, FileText, HelpCircle, BookOpen, Info, Zap, Sparkles, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigateTo: (page: string) => void;
  activePage?: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTo, activePage }) => {
  const email = 'mohammadbilalshaikh16@gmail.com';

  const handleLinkClick = (page: string, e: React.MouseEvent) => {
    e.preventDefault();
    onNavigateTo(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-neutral-800/80 bg-neutral-950 text-neutral-400 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="/"
              onClick={(e) => handleLinkClick('workspace', e)}
              className="flex items-center gap-2 text-base font-bold text-white hover:text-emerald-400 transition-colors"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FolderArchive className="h-4 w-4" />
              </span>
              <span>OptiMedia Studio</span>
            </a>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              High-performance media optimizer for creators, web developers, and video professionals. Intelligent 23% rate-controlled video compression, lossless audio stream copying, and browser-side batch image processing.
            </p>
            <div className="pt-2">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                Support & Inquiries
              </div>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-4"
                title="Click to email support"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{email}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Core Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Media Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/workspace"
                  onClick={(e) => handleLinkClick('workspace', e)}
                  className={`hover:text-emerald-400 transition-colors ${
                    activePage === 'workspace' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Batch Optimizer
                </a>
              </li>
              <li>
                <a
                  href="/inspector"
                  onClick={(e) => handleLinkClick('inspector', e)}
                  className={`hover:text-emerald-400 transition-colors ${
                    activePage === 'inspector' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Visual Dual-Inspector
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  onClick={(e) => handleLinkClick('docs', e)}
                  className={`hover:text-emerald-400 transition-colors ${
                    activePage === 'docs' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Engine Specifications
                </a>
              </li>
              <li>
                <a
                  href="/api/download-standalone"
                  download="optimedia-studio-linux-x64"
                  className="hover:text-emerald-300 text-emerald-400 transition-colors flex items-center gap-1.5 font-medium"
                  title="Download self-contained standalone binary for Linux x64"
                >
                  <span>Standalone Desktop App</span>
                  <span className="text-[10px] font-mono px-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    Binary
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Guides */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Guides & Help
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/guides"
                  onClick={(e) => handleLinkClick('guides', e)}
                  className={`hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activePage === 'guides' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  <span>Optimization Guides</span>
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  onClick={(e) => handleLinkClick('faq', e)}
                  className={`hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activePage === 'faq' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  <span>FAQ & Help Center</span>
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLinkClick('contact', e)}
                  className={`hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activePage === 'contact' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  <span>Contact & Support</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLinkClick('about', e)}
                  className={`hover:text-emerald-400 transition-colors ${
                    activePage === 'about' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleLinkClick('privacy', e)}
                  className={`hover:text-emerald-400 transition-colors ${
                    activePage === 'privacy' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => handleLinkClick('terms', e)}
                  className={`hover:text-emerald-400 transition-colors ${
                    activePage === 'terms' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-emerald-400 transition-colors text-neutral-400 font-mono text-[11px]"
                >
                  Email: {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Standards */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            &copy; {new Date().getFullYear()} OptiMedia Studio. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span>23% Lossless Rate Control Engine Active</span>
            </span>
            <span className="text-neutral-500">·</span>
            <a
              href="/privacy"
              onClick={(e) => handleLinkClick('privacy', e)}
              className="hover:text-neutral-200 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-neutral-500">·</span>
            <a
              href="/terms"
              onClick={(e) => handleLinkClick('terms', e)}
              className="hover:text-neutral-200 transition-colors"
            >
              Terms of Service
            </a>
            <span className="text-neutral-500">·</span>
            <a
              href="/contact"
              onClick={(e) => handleLinkClick('contact', e)}
              className="hover:text-neutral-200 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
