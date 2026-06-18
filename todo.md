# Frontend Polish: PWA & Omnichannel Updates

## Architecture Context
Our backend and PWA share target are now fully functional. Users can capture products in three ways: the Chrome Extension, the Mobile PWA native share sheet, and standard Web Uploads. We need to update our Home (`/`) and About (`/about`) pages to reflect this powerful omnichannel reality, maintaining our strict monochrome/Next.js aesthetic.

---

## Phase 1: Home Page (Landing & Omnichannel Guide)
- [ ] **Refactor the Installation Guide Window:** The current terminal window only explains the Chrome Extension. Refactor this into a sleek, 3-tab layout (or a clean 3-column grid) titled "Three Ways to Stash":
  - **Tab/Column 1: Desktop Extension:** (Keep the existing 8 steps for developer mode installation and the `Ctrl + Shift + X` hot key).
  - **Tab/Column 2: Mobile PWA (Native Feel):** 1. Open the website on your mobile browser (Safari/Chrome).
    2. Tap "Add to Home Screen" to install the PWA.
    3. Scroll Instagram, TikTok, or anywhere on your phone.
    4. Take a screenshot of a product you like.
    5. Tap the native OS "Share" button and select the "Stash" app icon.
    6. Boom! Instantly analyzed and stashed.
  - **Tab/Column 3: Web Dashboard:**
    1. Open the Stash dashboard.
    2. Click the [ + Upload Screenshot ] button.
    3. Select any local image file.
    4. Watch the AI categorize and fetch deals instantly.

## Phase 2: About Page (The Hackathon Pitch Update)
- [ ] **Update Section 1 (The Application):** Rewrite the summary to explicitly mention the three capture methods: "Antigravity passively captures products from any context via a desktop Chrome Extension hotkey (`Ctrl+Shift+K`), a mobile PWA native OS Share Target, or a direct web upload."
- [ ] **Update Section 3 (Cross-Channel Experience):** This is critical for the hackathon theme.
  - Emphasize the **Mobile PWA Share Target**. Explain that traditional apps force you to copy a link, open another app, and paste it. Stash uses the native OS Share Sheet so users can take a screenshot on Instagram and send it to Stash in 2 taps, without ever leaving their social feed.
- [ ] **Update the ASCII Architecture Art:** Update the `<pre>` block to include the Mobile PWA entry point:

                     [ User Inspiration ]
                              |
      +-----------------------+-----------------------+
      |                       |                       |
[ Chrome Ext ]          [ Mobile PWA ]         [ Web Dashboard ]
 (Ctrl+Shift+K)       (Native Share Target)    (Manual Upload)
      |                       |                       |
      +-----------------------+-----------------------+
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
               [ Next.js Real-Time Dashboard ]
