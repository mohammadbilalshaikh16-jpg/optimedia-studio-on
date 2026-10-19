import React from 'react';
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert, Scale, Mail } from 'lucide-react';

interface TermsPageProps {
  onBackToOptimizer: () => void;
  onNavigateTo: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBackToOptimizer, onNavigateTo }) => {
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
          <FileText className="h-4 w-4" />
          <span>TERMS & CONDITIONS</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-neutral-400">
          Last Updated: October 13, 2026 · Please read carefully before using OptiMedia Studio
        </p>
      </div>

      {/* Intro callout */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Scale className="h-4 w-4 text-emerald-400" />
          <span>Agreement Overview</span>
        </h2>
        <p className="text-xs text-neutral-300 leading-relaxed">
          By accessing or using OptiMedia Studio (“Service”, “we”, “our”), you agree to be bound by these Terms of Service. If you do not agree with any portion of these terms, please discontinue use of the website and tools immediately.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-8 text-sm text-neutral-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">1.</span>
            <span>Permitted Use of Service</span>
          </h2>
          <p className="text-xs text-neutral-300">
            OptiMedia Studio provides web-based image and video compression, format transcoding, and visual inspection utilities. You may use our service for personal, educational, non-profit, or commercial purposes, subject to the conditions outlined in these Terms.
          </p>
        </section>

        {/* Section 2: Intellectual Property & User Media Ownership */}
        <section className="space-y-3 p-5 rounded-xl border border-neutral-800 bg-neutral-900/40">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span>2. Ownership of Your Media Content</span>
          </h2>
          <div className="space-y-2 text-xs text-neutral-300">
            <p>
              <strong className="text-white">You retain complete, exclusive intellectual property ownership of all videos, audio tracks, and images you upload or process through OptiMedia Studio.</strong>
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-neutral-400">
              <li>We assert zero ownership, copyright, or licensing claims over your files.</li>
              <li>You grant us solely a temporary, strictly limited technical license to process, transcode, and return your file as requested by your browser session.</li>
              <li>We do not store, copy, showcase, or distribute your media to any third party.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Prohibited Uses */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">3.</span>
            <span>Prohibited Conduct</span>
          </h2>
          <p className="text-xs text-neutral-400">
            When using the service, you agree not to:
          </p>
          <ul className="space-y-1.5 pl-4 list-disc text-xs text-neutral-400">
            <li>Upload or transmit media containing malicious payloads, viruses, worms, or exploit scripts.</li>
            <li>Upload content that infringes upon third-party copyrights, trademarks, privacy rights, or other proprietary rights without authorization.</li>
            <li>Attempt to bypass rate limits, probe infrastructure vulnerabilities, or disrupt server availability through automated denial-of-service attacks.</li>
            <li>Use the service to process or distribute unlawful, defamatory, or abusive material.</li>
          </ul>
        </section>

        {/* Section 4: File Size Limits and Processing Limits */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">4.</span>
            <span>File Limits & Availability</span>
          </h2>
          <p className="text-xs text-neutral-300">
            To ensure fair resource distribution across all users, video processing is subject to a hard file limit of 10 GB per video. We strive to maintain continuous service availability; however, we do not guarantee uninterrupted or error-free operation. We reserve the right to temporarily pause or modify features for maintenance or updates.
          </p>
        </section>

        {/* Section 5: Disclaimer of Warranties */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">5.</span>
            <span>Disclaimer of Warranties</span>
          </h2>
          <p className="text-xs text-neutral-300">
            The service is provided on an “AS IS” and “AS AVAILABLE” basis without warranties of any kind, whether express or implied. While our pipeline incorporates comprehensive decode verification, we advise users to maintain backup copies of their original media before processing.
          </p>
        </section>

        {/* Section 6: Limitation of Liability */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-sm">6.</span>
            <span>Limitation of Liability</span>
          </h2>
          <p className="text-xs text-neutral-300">
            To the maximum extent permitted by applicable law, OptiMedia Studio and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to, use of, or inability to use the service.
          </p>
        </section>

        {/* Section 7: Modifications & Contact */}
        <section className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-400" />
            <span>7. Questions & Legal Notices</span>
          </h2>
          <p className="text-xs text-neutral-300">
            If you have questions regarding these Terms of Service or require legal clarification, please contact:
          </p>
          <div className="pt-1">
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
