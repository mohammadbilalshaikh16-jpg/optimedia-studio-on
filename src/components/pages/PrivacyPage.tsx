import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Cookie, Server, CheckCircle2, Mail, ExternalLink } from 'lucide-react';

interface PrivacyPageProps {
  onBackToOptimizer: () => void;
  onNavigateTo: (page: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBackToOptimizer, onNavigateTo }) => {
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
          <Shield className="h-4 w-4" />
          <span>LEGAL & TRANSPARENCY</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-400">
          Last Updated: October 13, 2026 · Effective Immediately
        </p>
      </div>

      {/* Summary Box */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Lock className="h-4 w-4 text-emerald-400" />
          <span>Privacy Commitment at a Glance</span>
        </h2>
        <p className="text-xs text-neutral-300 leading-relaxed">
          At OptiMedia Studio, we respect your privacy and are committed to complete transparency regarding how your media files and information are handled. We do not sell, rent, monetize, or harvest user media files. Your uploaded media is processed solely to perform the optimization you request and is purged automatically.
        </p>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8 text-sm text-neutral-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">1.</span>
            <span>How Media Files Are Processed & Stored</span>
          </h2>
          <div className="space-y-2 text-xs text-neutral-300">
            <p>
              We operate a privacy-first hybrid processing architecture designed to minimize any exposure of your data:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-neutral-400">
              <li>
                <strong className="text-neutral-200">Image Compression (Client-Side):</strong> Static images (JPEG, PNG, WebP, AVIF) are optimized directly in your local browser sandbox utilizing the HTML5 Canvas API and modern WebAssembly codecs. These files never leave your device or touch our servers.
              </li>
              <li>
                <strong className="text-neutral-200">Video Compression (Server-Side Temporary Processing):</strong> High-definition video files are uploaded in encrypted streaming chunks to our backend worker for multi-threaded FFmpeg rate-controlled compression. Video files are stored in an isolated temporary directory strictly for the duration of the transcoding operation.
              </li>
              <li>
                <strong className="text-neutral-200">Automated Deletion:</strong> Upon completion of your download or expiration of the processing session, temporary media files and pass logs are automatically and permanently purged from server disk storage. We maintain zero long-term storage or backups of your uploaded content.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">2.</span>
            <span>Information We Collect</span>
          </h2>
          <p className="text-xs text-neutral-400">
            We collect the minimum amount of technical data necessary to operate our service reliably:
          </p>
          <ul className="space-y-1.5 pl-4 list-disc text-xs text-neutral-400">
            <li>
              <strong className="text-neutral-200">Device & Browser Information:</strong> Browser type, operating system version, screen resolution, and language preferences to deliver appropriate codec fallbacks and responsive layouts.
            </li>
            <li>
              <strong className="text-neutral-200">Transient Processing Logs:</strong> Temporary HTTP status codes, file size measurements, and error codes used in real-time to render your progress bar and calculate SSIM/PSNR fidelity ratings.
            </li>
            <li>
              <strong className="text-neutral-200">Communications:</strong> If you contact us directly via email, we receive your email address and message contents to assist with your inquiry.
            </li>
          </ul>
        </section>

        {/* Section 3: Google AdSense & Advertising Disclosure */}
        <section className="space-y-3 p-5 rounded-xl border border-neutral-800 bg-neutral-900/40">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cookie className="h-5 w-5 text-amber-400" />
            <span>3. Google AdSense & Third-Party Advertising Disclosures</span>
          </h2>
          <div className="space-y-2 text-xs text-neutral-300">
            <p>
              To keep OptiMedia Studio free and accessible for creators worldwide, our website may display advertisements served by third-party advertising partners, including Google AdSense. In compliance with Google AdSense policies and privacy standards:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-neutral-400">
              <li>
                Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to our website or other websites across the Internet.
              </li>
              <li>
                Google’s use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising at any time by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  Google Ads Settings <ExternalLink className="h-3 w-3 inline" />
                </a>.
              </li>
              <li>
                Alternatively, you can opt out of a third-party vendor’s use of cookies for personalized advertising by visiting{' '}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  www.aboutads.info <ExternalLink className="h-3 w-3 inline" />
                </a>.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">4.</span>
            <span>Cookies and Local Storage</span>
          </h2>
          <p className="text-xs text-neutral-400">
            OptiMedia Studio uses HTML5 Local Storage and functional session cookies for the following operational needs:
          </p>
          <ul className="space-y-1.5 pl-4 list-disc text-xs text-neutral-400">
            <li>Remembering your preferred visual inspector slider positions and dark-theme configurations.</li>
            <li>Caching batch optimization queue selections during active browser tabs so you don't lose queue progress upon refreshing.</li>
            <li>Analytics cookies (such as privacy-friendly aggregated page view tracking) to measure tool usage without identifying individuals.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">5.</span>
            <span>Your Rights (GDPR & CCPA/CPRA Compliance)</span>
          </h2>
          <div className="space-y-2 text-xs text-neutral-300">
            <p>
              Depending on your location, you may have specific statutory privacy rights under regulations such as the General Data Protection Regulation (GDPR) or California Consumer Privacy Act (CCPA):
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-neutral-400">
              <li><strong className="text-neutral-200">Right to Access & Rectification:</strong> You may request information regarding any personal data we hold about you.</li>
              <li><strong className="text-neutral-200">Right to Erasure:</strong> Because all media files are automatically deleted upon processing, we retain zero persistent media records to delete.</li>
              <li><strong className="text-neutral-200">Right to Object / Opt-Out:</strong> You have the right to disable tracking cookies or opt out of personalized advertisements via your browser settings or Google Ad settings.</li>
            </ul>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">6.</span>
            <span>Data Security</span>
          </h2>
          <p className="text-xs text-neutral-300">
            All data transmitted between your browser and our optimization servers is secured using modern TLS 1.3 encryption in transit. Our backend workers run in isolated sandbox environments with strict read-only execution constraints preventing unauthorized access to temporary processing buffers.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">7.</span>
            <span>Updates to This Policy</span>
          </h2>
          <p className="text-xs text-neutral-300">
            We may periodically update this Privacy Policy to reflect technical changes in our compression engine or adjustments in applicable privacy laws. The updated revision date will always be noted at the top of this document.
          </p>
        </section>

        {/* Section 8: Contact */}
        <section className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-400" />
            <span>8. Privacy Inquiries & Contact</span>
          </h2>
          <p className="text-xs text-neutral-300">
            If you have questions regarding this Privacy Policy, your rights, or data practices, please contact our designated privacy officer directly:
          </p>
          <div className="pt-2">
            <a
              href="mailto:mohammadbilalshaikh16@gmail.com"
              className="text-sm font-semibold font-mono text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
            >
              mohammadbilalshaikh16@gmail.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
