'use client';

import Link from 'next/link';
import { Download, Terminal, ChevronRight } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Home() {
  const handleDownload = () => {
    navigator.clipboard.writeText('chrome://extensions');
    toast.success("URL copied! Opening extensions tab...");
    window.open('chrome://extensions', '_blank');
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center z-10">

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 animate-fade-in-up">
          Capture Inspiration Anywhere.<br />Track Deals Everywhere.
        </h1>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed animate-fade-in-up animate-delay-100">
          Stash is your passive AI shopping agent. It intercepts products from screenshots, videos, and real-world audio, instantly identifying the items and tracking live prices in the background.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-24 animate-fade-in-up animate-delay-200">
          <a
            href="/extension.zip"
            download="TeXpedition_Stash_Extension.zip"
            onClick={handleDownload}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors shadow-xl shadow-white/10"
          >
            <Download size={20} />
            Download Chrome Extension
          </a>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-white font-medium hover:bg-zinc-800 transition-colors"
          >
            View Dashboard
            <ChevronRight size={18} className="text-zinc-500" />
          </Link>
        </div>

        {/* Installation Guide */}
        <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-left animate-fade-in-up animate-delay-300">
          {/* Window Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-zinc-800">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
            </div>
            <div className="flex-1 flex justify-center">
              <span className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                <Terminal size={12} />
                How to Install & Use
              </span>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-6 md:p-8">
            <ol className="relative border-l border-zinc-800 ml-3 space-y-6">
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-zinc-800 rounded-full mt-1.5 -left-1.5 border border-zinc-900" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">Unzip the extension</h3>
                <p className="text-sm text-zinc-500">Extract the downloaded <code>extension.zip</code> file.</p>
              </li>
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-zinc-800 rounded-full mt-1.5 -left-1.5 border border-zinc-900" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">Open Extensions</h3>
                <p className="text-sm text-zinc-500">Open a new tab and paste <code className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded">chrome://extensions</code> (already in your clipboard!).</p>
              </li>
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-zinc-800 rounded-full mt-1.5 -left-1.5 border border-zinc-900" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">Enable Developer Mode</h3>
                <p className="text-sm text-zinc-500">Toggle <strong>"Developer mode"</strong> ON (top right).</p>
              </li>
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-zinc-200 rounded-full mt-1.5 -left-1.5 border border-zinc-900 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                <h3 className="text-sm font-semibold text-white mb-1">Load the Extension</h3>
                <p className="text-sm text-zinc-400">Click <strong>"Load unpacked"</strong> and select the unzipped folder.</p>
              </li>
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-zinc-800 rounded-full mt-1.5 -left-1.5 border border-zinc-900" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">Enable the extension</h3>
                <p className="text-sm text-zinc-500">Make sure the toggle switch is ON.</p>
              </li>
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-zinc-800 rounded-full mt-1.5 -left-1.5 border border-zinc-900" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">Watch</h3>
                <p className="text-sm text-zinc-500">Watch any YouTube video or Short and click the extension.</p>
              </li>
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-zinc-800 rounded-full mt-1.5 -left-1.5 border border-zinc-900" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">Capture</h3>
                <p className="text-sm text-zinc-500">Press <kbd className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono">Ctrl + Shift + X</kbd> when you see a product you like.</p>
              </li>
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-white rounded-full mt-1.5 -left-1.5 border border-zinc-900 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                <h3 className="text-sm font-semibold text-white mb-1">Boom!</h3>
                <p className="text-sm text-zinc-400">It is instantly captured, categorized, and stored in your Stash dashboard.</p>
              </li>
            </ol>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-zinc-800/50 flex w-full items-center justify-center text-sm text-zinc-500">
          <p className="flex items-center gap-2">
            Built with 🤍 by Team Syn3rgy
          </p>
        </footer>

      </div>
    </main>
  );
}
