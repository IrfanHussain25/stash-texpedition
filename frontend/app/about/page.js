import { Layers, Target, Heart } from 'lucide-react';

export default function About() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-24 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <header className="mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            Reimagining the Customer Journey
          </h1>
          <div className="h-1 w-20 bg-white rounded-full" />
        </header>

        <div className="space-y-16">
          
          {/* Section 1: What is it? */}
          <section className="animate-fade-in-up animate-delay-100">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Layers className="text-zinc-300" />
              The Application
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              Stash is a seamless product discovery agent. Rather than forcing you to context-switch when you find inspiration, Stash allows you to instantly capture products from YouTube videos, Instagram reels, real-world audio, or mobile screenshots using a simple <kbd className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono">Ctrl + Shift + X</kbd> hotkey. The app processes this data instantly, categorizes it, and builds a personalized, unified shopping dashboard.
            </p>
          </section>

          {/* Section 2: Key Features */}
          <section className="animate-fade-in-up animate-delay-200">
            <h2 className="text-2xl font-semibold mb-4 text-zinc-100">
              Key Features
            </h2>
            <div className="space-y-6">
              <div className="bg-white/5 border border-zinc-800 p-6 rounded-xl">
                <h3 className="text-white font-medium mb-2">Live Deal Extraction</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Stash instantly scans the web to natively extract the Top 3 live deals for the captured product, ensuring you are always presented with the best available price.
                </p>
              </div>
              <div className="bg-white/5 border border-zinc-800 p-6 rounded-xl">
                <h3 className="text-white font-medium mb-2">Instant Categorization</h3>
                <p className="text-zinc-400 leading-relaxed">
                  The app automatically clusters your captured items into intelligent, predefined groups on the fly. This enables a clean, clutter-free dashboard without any manual effort from you.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Hackathon Alignment */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm animate-fade-in-up animate-delay-300">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3 text-white">
              <Target className="text-zinc-300" />
              The Hackathon Theme
            </h2>
            <p className="text-zinc-400 italic mb-6 text-sm border-l-2 border-zinc-600 pl-4">
              "How can we use AI to deliver seamless customer experiences across channels while defining clear measures of success?"
            </p>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-white font-medium mb-2">Cross-Channel</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Traditional e-commerce is highly siloed. Stash shatters these walls by acting as an omnipresent layer. Whether you are browsing a blog on your laptop or listening to a podcast on your phone, you can capture the item seamlessly without leaving your video or breaking your flow.
                </p>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-2">Measurable Outcomes</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Passive inspiration is notoriously difficult to capture. By funneling all saves through our live-pricing system, Stash actively tracks prices and extracts deals. Success is measured not just by captures, but by turning passive inspiration into an active, tracked shopping experience.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: How It Works */}
          <section className="animate-fade-in-up animate-delay-300">
            <h2 className="text-2xl font-semibold mb-4 text-zinc-100">
              How it works (Technical POV)
            </h2>
            <p className="text-zinc-400 leading-relaxed text-lg mb-6">
              Stash operates on a lightning-fast, multi-modal AI pipeline. The moment a user triggers the <kbd className="text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono">Ctrl + Shift + K</kbd> hotkey, the extension provides immediate visual feedback, shifting from a <strong>Recording State</strong> (capturing audio/screen context) to an <strong>Analyzing State</strong>. The payload is securely routed to our Python backend, where Gemini performs zero-latency product extraction and categorization. Finally, the extension shifts to a <strong>Done State</strong>, signaling that the structured data—now enriched with live SerpApi Google Shopping metrics—has been seamlessly synced to your real-time dashboard.
            </p>

            <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-6 overflow-x-auto shadow-xl">
              <pre className="text-zinc-400 font-mono text-xs md:text-sm leading-relaxed">
{`                     [ User Inspiration ]
                              |
          +-------------------+-------------------+
          |                                       |
 [ Chrome Extension ]                   [ Web Dashboard ]
  (Ctrl + Shift + K)                   (Upload Screenshot)
          |                                       |
    [ UI States ]                                 |
    (1) 🔴 Recording                              |
    (2) ⏳ Analyzing                              |
    (3) ✅ Done                                   |
          |                                       |
          +-------------------+-------------------+
                              |
                    [ FastAPI Backend ]
                              |
              +---------------+---------------+
              |                               |
        [ Gemini AI ]              [ Google Lens & Shopping ]
      (Product Extraction           (Live Pricing, Ratings,
      & Auto-Categorization)          & Store Deal Links)
              |                               |
              +---------------+---------------+
                              |
                      [ Supabase DB ]
                              |
               [ Next.js Real-Time Dashboard ]`}
              </pre>
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-zinc-800/50 flex items-center justify-center text-sm text-zinc-500">
          <p className="flex items-center gap-2">
            Built with 🤍 by Team Syn3rgy
          </p>
        </footer>

      </div>
    </main>
  );
}
