'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 px-6 py-2 rounded-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 shadow-xl shadow-black/50">
        <div className="flex items-center gap-2 mr-4">
          <img src="/icon-192.png" alt="Stash Logo" className="w-6 h-6 rounded-md" />
          <span className="font-bold text-white text-sm tracking-tight">Stash</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Home
          </Link>
          <Link 
            href="/dashboard" 
            className={`text-sm font-medium transition-colors ${pathname === '/dashboard' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-medium transition-colors ${pathname === '/about' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
