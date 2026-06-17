import Link from 'next/link';
import { Download, Terminal, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[600px] h-[300px] bg-emerald-600/10 blur-[100px] rounded-[100%] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-xs text-purple-300 font-medium tracking-wide">TeXpedition Hackathon Submission</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
          Capture Inspiration Anywhere.<br />Track Deals Everywhere.
        </h1>
        
        {/* Subtext */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Stash is your passive AI shopping agent. It intercepts products from screenshots, videos, and real-world audio, instantly identifying the items and tracking live prices in the background.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-24">
          <a 
            href="/extension.zip" 
            download="TeXpedition_Stash_Extension.zip"
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
        <div className="w-full max-w-2xl bg-[#0d0d12] border border-zinc-800/80 rounded-xl shadow-2xl overflow-hidden text-left">
          {/* Window Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/80">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex-1 flex justify-center">
              <span className="text-xs text-zinc-500 font-mono flex items-center gap-2">
                <Terminal size={12} />
                How to Install in Developer Mode
              </span>
            </div>
          </div>
          
          {/* Window Body */}
          <div className="p-6 md:p-8">
            <ol className="relative border-l border-zinc-800 ml-3 space-y-8">
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-zinc-800 rounded-full mt-1.5 -left-1.5 border border-zinc-900" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">Unzip the extension</h3>
                <p className="text-sm text-zinc-500">Extract the downloaded <code>extension.zip</code> file to a folder on your computer.</p>
              </li>
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-zinc-800 rounded-full mt-1.5 -left-1.5 border border-zinc-900" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">Open Extensions</h3>
                <p className="text-sm text-zinc-500">Open Chrome and navigate to <code className="text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">chrome://extensions</code>.</p>
              </li>
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-zinc-800 rounded-full mt-1.5 -left-1.5 border border-zinc-900" />
                <h3 className="text-sm font-semibold text-zinc-200 mb-1">Enable Developer Mode</h3>
                <p className="text-sm text-zinc-500">Toggle <strong>&quot;Developer mode&quot;</strong> ON in the top right corner of the page.</p>
              </li>
              <li className="pl-6">
                <div className="absolute w-3 h-3 bg-purple-500 rounded-full mt-1.5 -left-1.5 border border-zinc-900 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                <h3 className="text-sm font-semibold text-white mb-1">Load the Extension</h3>
                <p className="text-sm text-zinc-400">Click <strong>&quot;Load unpacked&quot;</strong> and select the folder where you unzipped the extension.</p>
              </li>
            </ol>
          </div>
        </div>
        
      </div>
    </main>
  );
}
