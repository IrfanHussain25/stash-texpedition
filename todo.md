# Auto-Categorization & Accordion UI Setup

## Architecture Context
The database has been successfully updated with the `item_set` column. We are now updating the Antigravity backend to categorize data at the moment of AI extraction (zero latency) and overhauling the frontend to render a premium, grouped accordion UI. 

---

## Phase 1: Antigravity Backend (Zero-Latency Tagging)
**Workspace:** `backend/main.py`
**Goal:** Inject the 10 master categories into the AI pipelines and build a one-time cleanup route for existing data.

- [ ] **Update Audio Prompt:** Modify the Gemini prompt inside `/api/audio` to explicitly list the 10 categories and demand `item_set` in the output JSON schema.
- [ ] **Update Vision Prompt:** Modify the Gemini prompt inside `/api/vision` to do the same for image extractions.
- [ ] **Update Database Inserts:** In both routes, map the newly extracted `item_set` value into the `row` dictionary before executing the Supabase `insert` command. Ensure a fallback to "Miscellaneous" if the AI fails to categorize.
- [ ] **Build Cleanup Endpoint:** Create a `GET /api/admin/categorize-all` route. 
  - Fetch all items currently labeled "Miscellaneous".
  - Loop through them, sending their `product_name` and `brand` to Gemini with the strict category list.
  - Execute a Supabase `update` for each item to backfill the database.

---

## Phase 2: Frontend UI (The Accordion Dashboard)
**Workspace:** `frontend/components/StashGrid.js`
**Goal:** Transform the flat grid into a grouped, toggleable list to eliminate vertical clutter.

- [ ] **Derived State Grouping:** Create a JavaScript `reduce` function that takes the raw `stash` array and converts it into an object grouped by `item_set` keys.
- [ ] **Accordion Toggle State:** Add a `useState` hook to track which categories are collapsed or expanded (defaulting to expanded).
- [ ] **Refactor Render Loop:** Replace the single grid map with a nested map:
  - First loop iterates through the category names (keys).
  - Renders a clickable Header component containing the category name, item count badge, and a Chevron up/down icon.
  - Second loop iterates through the items within that specific category, rendering them inside the standard responsive grid.
- [ ] **Conditional Rendering:** Ensure the inner grid of items is wrapped in a conditional block so it hides entirely from the DOM when the user clicks the category header.