# Full Application Polish: UI Overhaul, Categorization & Pitch

## Architecture Context
This is the master checklist to take the hackathon project to the finish line. We are restructuring into a multi-page Next.js app, enforcing a strict minimalist monochrome UI, implementing zero-latency AI categorization in the backend, and building a grouped accordion dashboard. Finally, we are adding a high-converting landing page and a pitch-perfect About page.

---

## Phase 1: Global Theme & Minimalist Redesign
- [ ] **Color Palette Lockdown:** Update `tailwind.config.js` to eliminate multi-color clutter. 
  - Use Pure Black (`#000000`) or deep Zinc (`#09090B`) for backgrounds.
  - Use Pure White (`#FFFFFF`) for headings and `text-zinc-400` for secondary text.
  - Use `border-zinc-800` and `bg-white/5` for glassmorphic cards.
  - Remove all purple background glows, radial gradients, and active link colors.
- [ ] **Typography:** Use a modern sans-serif (Geist or Inter) with `tracking-tight`. Apply subtle text gradients (e.g., `bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent`) for major headlines instead of colors.

## Phase 2: Routing & Navigation
- [ ] **App Router Setup:** Move the current dashboard into `app/dashboard/page.js`. Create `app/page.js` (Home) and `app/about/page.js` (About).
- [ ] **Minimalist Floating Navbar:** Create `Navbar.js` and add it to `layout.js`.
  - Style: `fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-6 py-2`.
  - Links: Home, Dashboard, About. Text should be `text-zinc-400 hover:text-white` with a simple brightness shift on active states.

## Phase 3: Backend Auto-Categorization (Python/FastAPI)
- [ ] **Zero-Latency Prompts:** Update the Gemini prompts in `/api/audio` and `/api/vision` to strictly enforce outputting an `item_set` from 10 predefined categories (Electronics & Tech, Clothing & Apparel, Footwear, Home & Kitchen, Beauty & Wellness, Sports & Outdoors, Books & Media, Toys & Games, Groceries & Consumables, Miscellaneous).
- [ ] **Database Mapping:** Ensure the `row` dictionary maps `item_set` before pushing to Supabase.
- [ ] **Nuclear Cleanup Route:** Add the `/api/admin/categorize-all` route that fetches *all* items, forces Gemini to strictly categorize them into the 10 sets (stripping quotes/punctuation), and backfills the database.

## Phase 4: Dashboard Cleanup & Accordion UI
- [ ] **Remove Distractions:** Delete the legacy "TeXpedition Stash" title, the "Live" badge, and the massive dashed dropzone box from the dashboard header.
- [ ] **Compact Upload:** Replace the dropzone with a sleek, primary button or minimalist floating field: `[ + Upload Screenshot ]`.
- [ ] **Group State:** In `StashGrid.js`, create a derived state that runs a `reduce` function to group the `stash` array by `item_set`.
- [ ] **Accordion Rendering:** Replace the flat grid with a nested map loop:
  - Render a clickable category header (Category Name, Item Count Badge, Chevron Up/Down icon).
  - Inside the header's conditional render block, render the standard grid of `ProductCard` items belonging to that category.

## Phase 5: Home Page (Landing & Onboarding)
- [ ] **Hero Section:** Headline: "Capture Inspiration Anywhere. Track Deals Everywhere." using the grayscale text gradient. Subtext in `text-zinc-400`.
- [ ] **Smart Download Button:** A pure white button with black text. Add an `onClick` that:
  1. Triggers the `<a href="/extension.zip" download>` file download.
  2. Copies `chrome://extensions` to the user's clipboard.
  3. Triggers `toast.success("URL copied! Open a new tab and paste to install.")`.
- [ ] **Installation Guide Window:** A sleek, dark terminal-style window detailing the 8 workflow steps:
  1. Unzip the downloaded extension file.
  2. Open a new tab and paste `chrome://extensions` (already in your clipboard!).
  3. Toggle "Developer mode" ON (top right).
  4. Click "Load unpacked" and select the unzipped folder.
  5. Enable the extension.
  6. Watch any YouTube video or Short and click the extension.
  7. Press `Ctrl + Shift + K` when you see a product you like.
  8. Boom! It is instantly captured, categorized, and stored in your Stash dashboard.
  *Note: Ensure active/inactive step indicators use pure white/zinc dots, no purple.*

## Phase 6: About Page (The Hackathon Pitch)
- [ ] **Header:** "Reimagining the Customer Journey".
- [ ] **Section 1: The Application:** Explain how Antigravity passively captures products across video, shorts, audio, and screenshots via the `Ctrl + Shift + K` hotkey.
- [ ] **Section 2: Key AI Features:** - **Live Deal Extraction:** Detail how the backend extracts the Top 3 live Google Shopping deals natively.
  - **Zero-Latency Categorization:** Explain how Gemini clusters data into 10 groups on the fly for the Accordion UI.
- [ ] **Section 3: The Hackathon Theme:** Answer the prompt directly.
  - **Cross-Channel:** Seamless shopping without leaving the video or breaking the user experience.
  - **Measurable Outcomes:** Turning passive inspiration into an active, tracked e-commerce funnel via price checking.
- [ ] **Footer:** Centered at the bottom: `"Built with 🤍 by Team Syn3rgy"`.