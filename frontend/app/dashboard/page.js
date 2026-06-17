'use client';

import { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import StashGrid from '@/components/StashGrid';
import { Zap } from 'lucide-react';

export default function Dashboard() {
  const [refreshSignal, setRefreshSignal] = useState(0);

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-24">

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex flex-col gap-10">
        {/* Top Controls */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold tracking-tight text-white">Your Stash</h2>
          <UploadZone onInserted={() => setRefreshSignal((s) => s + 1)} />
        </div>
          <StashGrid refreshSignal={refreshSignal} />
      </div>
    </main>
  );
}
