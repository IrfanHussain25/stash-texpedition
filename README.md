# Stash - AI-Powered Passive Product Discovery Agent

Stash is an omnichannel, passive shopping agent that captures inspiration across platforms (Desktop Chrome, Mobile iOS/Android via PWA Share Target, and Direct Web Uploads). It uses a powerful multimodal AI pipeline to instantly extract, categorize, and track live deals from Google Shopping.

## System Architecture

Stash operates on a lightning-fast, multi-modal AI pipeline. The moment a user triggers the `Ctrl + Shift + K` hotkey (or shares a screenshot via mobile PWA), the payload is securely routed to our Python backend, where **Gemini Flash** performs zero-latency product extraction and categorization. Finally, the structured data—now enriched with live **Google Shopping (SerpApi)** metrics—is perfectly synced to a real-time Next.js dashboard via **Supabase**.

## Getting Started: How to Run Locally

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Supabase Account
- Gemini API Key
- SerpApi Key

### 1. Backend Setup (FastAPI)
The backend powers the AI categorization and deal extraction pipeline.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `.\venv\Scripts\activate` on Windows
pip install -r requirements.txt
```

Ensure your `.env` is configured in the backend folder:
```env
GEMINI_API_KEY=your_key
SERPAPI_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
```

Run the backend:
```bash
uvicorn main:app --reload
```
The backend will run on `http://127.0.0.1:8000`.

### 2. Frontend Setup (Next.js App Router)
The frontend serves the Web Dashboard, the Mobile PWA, and hosts the Chrome Extension download.
```bash
cd frontend
npm install
```

Ensure your frontend `.env.local` is configured with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

Run the frontend:
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`.

---

## Three Ways to Stash (Omnichannel Capture)

### 1. Desktop Chrome Extension
1. Navigate to your local frontend (`http://localhost:3000`) and click **"Download Chrome Extension"** to get the `extension.zip` file.
2. Extract the unzipped folder.
3. Open a new tab in Chrome and go to `chrome://extensions`.
4. Toggle **"Developer mode"** ON (top right corner).
5. Click **"Load unpacked"** and select the unzipped folder.
6. Make sure the toggle switch is ON.
7. Go to any YouTube video, Instagram reel, or blog post and hit `Ctrl + Shift + X` to instantly capture and stash products!

### 2. Mobile PWA (Native OS Share Target)
1. Open the Stash website (`http://localhost:3000` or your deployed URL) on your mobile browser (Safari/Chrome).
2. Tap the browser's share icon and select **"Add to Home Screen"** to install the PWA.
3. Now, you can browse social media (TikTok, Instagram, etc.) natively on your phone.
4. When you see a product you like, take a screenshot.
5. Tap the native OS "Share" button on the screenshot preview and select the "Stash" app icon.
6. The image is instantly routed to the Stash pipeline and categorized on your dashboard!

### 3. Direct Web Dashboard
1. Open the Stash dashboard at `http://localhost:3000/dashboard`.
2. Click the **[ + Upload Screenshot ]** button.
3. Select any local image file from your device.
4. Watch the AI categorize the product and fetch live deals instantly.

---
Built with 🤍 by Team Syn3rgy
