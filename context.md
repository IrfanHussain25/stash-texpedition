Project Context: TeXpedition Hackathon - Backend Engine ("Antigravity")
The Overall Project:
We are building an AI-powered "Passive Agent" for the TeXpedition hackathon. The system allows users to seamlessly save products they hear about in audio streams or see in screenshots online into a centralized digital dashboard with zero friction.

Your Role (The Backend):
This workspace is strictly for the backend engine, codenamed "Antigravity". You do not need to worry about the Next.js frontend UI or the Chrome extension—another developer is building those in a completely separate, isolated codebase. Your sole job is to build a fast, lightweight API server that catches unstructured data payloads, processes them, and writes the structured data to our shared cloud database.

The Tech Stack:

Language: Python 3.x

Framework: FastAPI (with Uvicorn)

Database: Supabase (PostgreSQL) via the supabase Python client

AI/Extraction Engine: Google Gemini API (to be implemented in later phases)

Environment Management: python-dotenv

The Database Schema:
We are connecting to an already-configured Supabase project. The target table is named stash_items. The schema is:

id (uuid, primary key)

type (text - e.g., 'audio', 'screenshot', 'context')

product_name (text)

brand (text)

price (numeric)

url (text)

discount_active (boolean, default false)

created_at (timestampz)

Phase 1 Objectives: The Infrastructure & Handshake
For Phase 1, we are just laying the structural foundation and ensuring we can successfully connect to the database. We will build the Gemini AI extraction logic in Phase 2.

Please execute the following steps sequentially to populate this empty directory:

Project Initialization:

Create a requirements.txt file including fastapi, uvicorn, supabase, python-dotenv, and pydantic.

Create a .env file template (with placeholders for SUPABASE_URL, SUPABASE_KEY, and GEMINI_API_KEY).

Core Application Setup (main.py):

Initialize the FastAPI application.

Set up CORS middleware to allow all origins (allow_origins=["*"]). This is critical because the frontend Chrome extension will be pinging this local server via an Ngrok tunnel.

Initialize the Supabase client using the environment variables.

The Health & Handshake Endpoints:

Create a simple GET /api/health route that returns {"status": "Antigravity engine online"}.

Create a POST /api/test-insert route using a Pydantic model. This route should accept a simple JSON payload containing type, product_name, and price. It must use the Supabase client to insert this mock row directly into the stash_items table and return the success response.

Please generate the necessary code and file structure for Phase 1. Let me know when the code is ready so I can run the server and test the /api/test-insert endpoint to verify the database connection!


# Project Stash: Execution Roadmap

## Architecture Context
We are building a "Passive Agent" for the TeXpedition hackathon. The system consists of two isolated parts communicating via Supabase:
1. **Backend Engine (Backend):** A Python/FastAPI server handling Gemini AI extraction.
2. **Module 2 Dashboard (Frontend):** A Next.js PWA for viewing the extracted items.

---

## Part 1: Backend Phase 2 (The AI Engine)
**Workspace:** `/backend` directory
**Goal:** Connect the initialized FastAPI server to Google's Gemini API for data extraction.

- [x] **Dependency Update:** Add `google-generativeai` to `requirements.txt` and install it.
- [x] **Environment Setup:** Ensure `GEMINI_API_KEY` is added to the `.env` file.
- [x] **Build Audio Endpoint (`POST /api/audio`):**
  - Accept a JSON payload containing a Base64 audio string.
  - Send the audio to the Gemini API with a strict system prompt: *"Analyze this audio. Extract the product name, brand, and estimated price. Return ONLY a valid JSON object."*
  - Use the Supabase client to insert this parsed JSON into the `stash_items` table with `type: 'audio'`.
- [x] **Build Vision Endpoint (`POST /api/vision`):**
  - Accept a JSON payload containing a Base64 image string (for screenshots).
  - Pass the image to the Gemini Vision API to extract product intent.
  - Insert the parsed data into the Supabase `stash_items` table with `type: 'screenshot'`.


---

## Part 2: Module 2 (The Next.js Dashboard)
**Workspace:** `/frontend` directory
**Goal:** Build the user-facing "Screenshot Graveyard" and real-time stash grid.

- [x] **Initialization:** Scaffolded with `create-next-app@latest` (Next.js 16, App Router, Tailwind v4, JavaScript).
- [x] **Dependencies:** Installed `@supabase/supabase-js react-dropzone lucide-react`.
- [x] **Environment Setup:** Created `frontend/.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_API_URL`.
- [x] **Build Upload Component:** `components/UploadZone.js` – drag-and-drop zone, Base64 conversion, POST to `/api/vision`, animated feedback states.
- [x] **Build Real-Time Grid (`StashGrid.js`):** Cards with type badges, skeleton loading, empty state, and `supabase.channel()` listener for instant live updates.
- [x] **Dev server running:** http://localhost:3000
