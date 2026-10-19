import React, { useState } from 'react';
import { ArrowLeft, Mail, Copy, Check, Send, MessageSquare, Clock, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

interface ContactPageProps {
  onBackToOptimizer: () => void;
  onNavigateTo: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBackToOptimizer, onNavigateTo }) => {
  const email = 'mohammadbilalshaikh16@gmail.com';
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !message) return;

    // Build mailto fallback url
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      subject || 'Inquiry from OptiMedia Studio'
    )}&body=${encodeURIComponent(
      `Name: ${name || 'N/A'}\nSender Email: ${userEmail}\n\nMessage:\n${message}`
    )}`;

    // Open user's default email client with prefilled details
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
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
          <Mail className="h-4 w-4" />
          <span>GET IN TOUCH</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
          Contact Us
        </h1>
        <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
          Have questions about video compression, encountered an unusual codec format, or want to share feedback? We’re here to help you get the best optimization results.
        </p>
      </div>

      {/* Primary Email Banner Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-neutral-900/80 to-neutral-900 border border-emerald-500/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              <span>Official Support Email Address</span>
            </div>
            <a
              href={`mailto:${email}`}
              className="text-lg sm:text-2xl font-bold font-mono text-white hover:text-emerald-400 transition-colors break-all underline decoration-emerald-500/40 underline-offset-4"
              title="Click to compose email"
            >
              {email}
            </a>
            <p className="text-xs text-neutral-400 mt-1">
              Direct inbox monitored by the engineering and product team.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-xs font-medium text-neutral-200 hover:bg-neutral-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-neutral-400" />
                  <span>Copy Address</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-semibold hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Send Mail</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2-Column Section: Form & Support Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Support Meta Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>Response Time</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We respond to technical questions, partnership proposals, and bug reports within <strong className="text-neutral-200">24 to 48 hours</strong> Monday through Friday.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              <span>What We Can Help With</span>
            </div>
            <ul className="text-xs text-neutral-400 space-y-1.5 list-disc pl-4">
              <li>Batch compression workflows for high-volume content</li>
              <li>HDR, Dolby Vision, and 10-bit color retention inquiries</li>
              <li>Audio synchronization and stream copy tuning</li>
              <li>General website feedback & user experience suggestions</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <HelpCircle className="h-4 w-4 text-emerald-400" />
              <span>Need Quick Answers?</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Check our Help / FAQ section for instant guidance on file formats, size limits, and browser performance.
            </p>
            <button
              onClick={() => onNavigateTo('faq')}
              className="text-xs text-emerald-400 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Visit FAQ & Help</span>
            </button>
          </div>
        </div>

        {/* Interactive Contact Form Column */}
        <div className="md:col-span-2">
          <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Send a Message</h2>
              <p className="text-xs text-neutral-400">
                Fill out the form below to draft an email directly to our team.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-white">Opening Your Email Client</h3>
                <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
                  Your mail app was launched with your inquiry prepared. If your mail app didn't open, write directly to{' '}
                  <a href={`mailto:${email}`} className="text-emerald-400 font-mono font-medium underline">
                    {email}
                  </a>.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-neutral-400 hover:text-white underline cursor-pointer pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Your Email <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="E.g., Compression query or feature suggestion"
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Message <span className="text-emerald-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, video specifications, or thoughts..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500 transition-colors resize-y"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-neutral-500">
                    We never share your email address with third parties.
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 text-xs font-semibold hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit via Email</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
