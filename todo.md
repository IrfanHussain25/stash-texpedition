# Frontend Final Polish: Minimalist UI, Routing & Hackathon Pitch

## Architecture Context
We are migrating to a multi-route Next.js App Router structure (`/`, `/dashboard`, `/about`). We are also executing a massive UI redesign: stripping out all unnecessary colors to enforce a strict black/white monochrome theme with a single electric purple accent, and replacing the bulky dashboard UI with minimalist components.

---

## Phase 1: Global Theme & Minimalist Redesign
- [ ] **Color Palette Lockdown:** Update `tailwind.config.js` to eliminate the multi-color clutter. 
  - Backgrounds: Pure Black (`#000000`) or very dark Zinc (`#09090B`).
  - Text: Pure White (`#FFFFFF`) for headings, soft gray (`#A1A1AA`) for secondary text.
  - Borders/Glass: `border-white/10` and `bg-white/5`.
  - **The Single Accent:** Use an electric purple (`#A855F7`) strictly for active states, primary buttons, or subtle highlights.
- [ ] **Typography:** Ensure a modern sans-serif (like Inter or Geist) with tight tracking (`tracking-tight`).

## Phase 2: Next.js Routing & Floating Navbar
- [ ] **Folder Structure:** Move the current `StashGrid` into `app/dashboard/page.js`. Create `app/page.js` (Home) and `app/about/page.js` (About).
- [ ] **Minimalist Navbar Component:** Build a `Navbar.js` that floats at the top.
  - Style: `fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-6 py-2`.
  - Links: Home, Dashboard, About. Use white text that softly glows purple on hover.

## Phase 3: Dashboard Cleanup (The "No Distractions" View)
- [ ] **Remove Legacy Header:** Delete the "TeXpedition Stash", "Passive AI Product Agent", and the green "Live" button from the top of the dashboard.
- [ ] **Compact Upload Button:** completely delete the massive "SCREENSHOT GRAVEYARD" dashed box. 
  - Replace it with a sleek, small, primary action button or a compact, single-line input field floating near the top: `[ + Upload Screenshot ]`.
  - Keep the drag-and-drop functionality active on the entire window natively, or bound strictly to this small button.

## Phase 4: The Home Page (Landing & Smart Download)
- [ ] **Hero Section:** "Capture Inspiration Anywhere. Track Deals Everywhere." Keep the UI stark black with white text.
- [ ] **Smart Extension Download Button:** - Add an onClick handler to the download button that does two things:
    1. Triggers the download (`<a href="/extension.zip" download>`).
    2. Copies `chrome://extensions` to the user's clipboard and triggers a toast: `toast.success("Extension downloaded! URL copied to clipboard. Open a new tab and paste to install.")`.
- [ ] **Installation Guide & Workflow:** Create a clean, glassmorphic card titled "How to Install & Use":
  1. Extract the downloaded `extension.zip` file.
  2. Open a new tab and paste `chrome://extensions` (already in your clipboard!).
  3. Toggle "Developer mode" ON (top right corner).
  4. Click "Load unpacked" and select the extracted folder.
  5. Enable the extension.
  6. Watch any YouTube video or Short.
  7. Press `Ctrl + Shift + K` when you see a product you like.
  8. Boom! It is instantly captured, categorized, and stored in your Stash dashboard.

## Phase 5: The About Page (The Hackathon Pitch)
- [ ] **Header:** "Reimagining the Customer Journey"
- [ ] **Section 1: What is the Application?** A brief summary of how Antigravity passively captures products from any context (YouTube videos, Shorts, audio, mobile screenshots) using a simple `Ctrl + Shift + K` hotkey.
- [ ] **Section 2: Key AI Features (The "Wow" Factor):** - **Live Deal Extraction:** The backend instantly hits Google Shopping to extract the Top 3 live deals.
  - **Zero-Latency Categorization:** Gemini automatically groups items into 10 predefined sets on the fly, rendering them in a clean, clutter-free Accordion UI.
- [ ] **Section 3: Addressing the Hackathon Theme:**
  - **Cross-Channel Experience:** Explain how the extension captures inspiration without breaking the user's flow. They don't have to leave YouTube or stop their video to shop.
  - **Measurable Outcomes:** Explain how extracting the top 3 live deals turns passive scrolling into a measurable, conversion-ready e-commerce funnel.
- [ ] **Footer:** `"Built with 💜 by Team Syn3rgy"` (centered, small font at the bottom).