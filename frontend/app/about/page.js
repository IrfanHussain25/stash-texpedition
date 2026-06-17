import { Layers, Target, Heart } from 'lucide-react';

export default function About() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-600/10 blur-[120px] rounded-[100%] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Reimagining the Customer Journey
          </h1>
          <div className="h-1 w-20 bg-purple-500 rounded-full" />
        </header>

        <div className="space-y-16">
          
          {/* Section 1: What is it? */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Layers className="text-purple-400" />
              The Antigravity Engine
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              Stash is a passive, AI-powered product discovery agent. Rather than forcing users to context-switch when they find inspiration, our Chrome extension and PWA allow them to instantly capture products from YouTube videos, Instagram reels, real-world audio, or mobile screenshots. The Antigravity engine processes this unstructured data instantly, categorizes it, and builds a unified shopping dashboard.
            </p>
          </section>

          {/* Section 2: Hackathon Alignment */}
          <section className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-white">
              <Target className="text-emerald-400" />
              Addressing the Prompt
            </h2>
            <p className="text-zinc-400 italic mb-6 text-sm border-l-2 border-emerald-500/50 pl-4">
              &quot;How can we use AI to deliver seamless customer experiences across channels while defining clear measures of success?&quot;
            </p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-emerald-400 font-medium mb-2">1. Cross-Channel Seamlessness</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Traditional e-commerce is highly siloed. Stash shatters these walls by acting as an omnipresent layer. Whether a user is browsing a blog on their laptop or listening to a podcast on their phone, they can capture the item seamlessly without interrupting their flow. The customer journey is unified across all digital and physical channels.
                </p>
              </div>
              
              <div>
                <h3 className="text-emerald-400 font-medium mb-2">2. Defining Measures of Success</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Passive inspiration is notoriously difficult to measure. By funneling all captures through our Google Shopping pipeline (via SerpApi), we track live prices, aggregate reviews, and extract deals. Success is measured not just by captures, but by driving high-intent, price-optimized conversions from previously un-monetizable fleeting moments of inspiration.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: User Benefits */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-zinc-100">
              The &quot;Second Brain&quot; for Shopping
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              Users no longer need to manage scattered bookmarks, forgotten screenshot folders, or messy Notes apps. Stash serves as an automated &quot;second brain,&quot; eliminating friction. By categorizing automatically and monitoring for deals, it empowers the user to purchase when the price is right, drastically improving the overall customer experience.
            </p>
          </section>
          
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-zinc-800/50 flex items-center justify-center text-sm text-zinc-500">
          <p className="flex items-center gap-2">
            Built with <Heart size={14} className="text-purple-400 fill-purple-400" /> by Team Syn3rgy
          </p>
        </footer>

      </div>
    </main>
  );
}
