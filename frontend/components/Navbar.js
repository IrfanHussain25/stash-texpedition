'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 px-6 py-3 rounded-full bg-zinc-900/70 backdrop-blur-md border border-zinc-800 shadow-xl shadow-black/50">
        <div className="flex items-center gap-2 mr-4">
          <img src="/icon-192.png" alt="Stash Logo" className="w-6 h-6 rounded-md" />
          <span className="font-bold text-white text-sm tracking-tight">Stash</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Home
          </Link>
          <Link 
            href="/dashboard" 
            className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-medium transition-colors ${pathname === '/about' ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
