'use client';

import { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import StashGrid from '@/components/StashGrid';
import { Zap } from 'lucide-react';

export default function Dashboard() {
  const [refreshSignal, setRefreshSignal] = useState(0);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-24">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="absolute -bottom-64 -right-64 w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex flex-col gap-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-sky-500 shadow-lg shadow-purple-500/20">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TeXpedition Stash</h1>
              <p className="text-xs text-zinc-400">Passive AI Product Agent</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium font-mono">Live</span>
          </div>
        </header>

        {/* Upload section */}
        <section>
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
            Screenshot Graveyard
          </h2>
          <UploadZone onInserted={() => setRefreshSignal((s) => s + 1)} />
        </section>

        {/* Grid section */}
        <section>
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
            Your Stash
          </h2>
          <StashGrid refreshSignal={refreshSignal} />
        </section>
      </div>
    </main>
  );
}
