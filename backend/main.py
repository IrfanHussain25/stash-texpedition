import os
import json
import base64
import uuid
import requests
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
from supabase import create_client, Client
from typing import Optional

# ---------------------------------------------------------------------------
# Environment
# ---------------------------------------------------------------------------
load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
SERP_API_KEY: str = os.getenv("SERP_API_KEY", "")

# Global clients – initialised in lifespan
supabase: Optional[Client] = None
gemini_model = None

# System prompt shared by basic endpoints
EXTRACTION_PROMPT = (
    "You are a product data extraction engine. Analyze the provided content. "
    "Extract the product name, brand, and estimated price. "
    "Return ONLY a valid JSON object with keys: "
    "\"product_name\" (string), \"brand\" (string), \"price\" (number or null). "
    "Do not include any explanation, markdown, or extra text."
)

# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global supabase, gemini_model

    # Supabase
    if SUPABASE_URL and SUPABASE_KEY:
        try:
            supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
            print("✅  Supabase client initialised successfully.")
        except Exception as exc:
            print(f"⚠️  Supabase init failed: {exc}")
    else:
        print("⚠️  SUPABASE_URL / SUPABASE_KEY not set – DB endpoints disabled.")

    # Gemini
    if GEMINI_API_KEY:
        try:
            genai.configure(api_key=GEMINI_API_KEY)
            gemini_model = genai.GenerativeModel("gemini-3.1-flash-lite")
            print("✅  Gemini client initialised successfully.")
        except Exception as exc:
            print(f"⚠️  Gemini init failed: {exc}")
    else:
        print("⚠️  GEMINI_API_KEY not set – AI endpoints disabled.")

    yield

# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Antigravity Engine",
    description="TeXpedition backend – catches unstructured data and writes structured products to Supabase.",
    version="0.3.0",
    lifespan=lifespan,
)

# CORS – wide open so the Chrome extension/mobile PWA can reach us via Ngrok
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic Models
# ---------------------------------------------------------------------------

class AudioPayload(BaseModel):
    audio_b64: str          # Base64-encoded audio file
    mime_type: str = "audio/webm"   # e.g. audio/webm, audio/mp4, audio/wav
    image_b64: Optional[str] = None # Base64-encoded screenshot

class VisionPayload(BaseModel):
    image_b64: str          # Base64-encoded screenshot
    mime_type: str = "image/png"    # e.g. image/png, image/jpeg, image/webp

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def get_supabase() -> Client:
    if supabase is None:
        raise HTTPException(
            status_code=503,
            detail="Supabase not configured – check SUPABASE_URL and SUPABASE_KEY in .env.",
        )
    return supabase

def get_gemini():
    if gemini_model is None:
        raise HTTPException(
            status_code=503,
            detail="Gemini not configured – check GEMINI_API_KEY in .env.",
        )
    return gemini_model

def parse_gemini_json(raw: str) -> dict:
    """Strip markdown fences if Gemini wraps the response and parse JSON."""
    text = raw.strip()
    if text.startswith("```"):
        lines = text.splitlines()
        text = "\n".join(lines[1:-1]).strip()
    return json.loads(text)

def insert_stash_item(db: Client, row: dict) -> dict:
    result = db.table("stash_items").insert(row).execute()
    return result.data

def upload_image_to_supabase(db_client: Client, base64_string: str, mime_type: str = "image/jpeg") -> str:
    """Uploads a base64 encoded image to Supabase storage and returns the public URL."""
    try:
        clean_b64 = base64_string
        if "," in clean_b64:
            clean_b64 = clean_b64.split(",")[1]

        image_bytes = base64.b64decode(clean_b64)
        file_name = f"{uuid.uuid4()}.png" 
        
        db_client.storage.from_("stash-images").upload(
            file_name, 
            image_bytes, 
            {"content-type": mime_type}
        )
        
        return db_client.storage.from_("stash-images").get_public_url(file_name)
    except Exception as exc:
        print(f"⚠️ Image upload failed: {exc}")
        return ""

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/api/health")
async def health_check():
    """Liveness probe."""
    return {
        "status": "Antigravity engine online",
        "db": "connected" if supabase else "not configured",
        "ai": "ready" if gemini_model else "not configured",
    }


@app.post("/api/video")
async def process_audio(payload: AudioPayload):
    """
    Accept a Base64 audio string, send it to Gemini for product extraction,
    and insert the result into stash_items with type='audio'.
    """
    db = get_supabase()
    get_gemini()
    model = genai.GenerativeModel('gemini-3.1-flash-lite')

    try:
        audio_bytes = base64.b64decode(payload.audio_b64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Base64 audio data.")

    print("\n🎧 Sending audio payload to Gemini...")

    prompt = """
    Listen to this 15-second audio clip.
    1. Transcribe the main content of the audio.
    2. Identify any specific product, item, or software mentioned.
    3. Identify the brand if mentioned.
    4. Identify the price if mentioned (return as a number, or null if not mentioned).
    5. Categorize the product into EXACTLY ONE of the following 10 master categories:
       - Electronics & Tech
       - Clothing & Apparel
       - Footwear
       - Home & Kitchen
       - Beauty & Wellness
       - Sports & Outdoors
       - Books & Media
       - Toys & Games
       - Groceries & Consumables
       - Miscellaneous

    CRITICAL RULE: If the audio is completely silent, contains no human speech, or is just static/background noise, you MUST output "SILENCE_DETECTED" for the transcription, and null for the product, brand, and price. DO NOT invent a product.

    You MUST respond with a single JSON object.
    You MUST use exactly these four keys:
    {
        "transcription": "string",
        "product_name": "string" or null,
        "brand": "string" or null,
        "price": number or null,
        "item_set": "string"
    }
    """

    try:
        response = model.generate_content(
            [prompt, {"mime_type": payload.mime_type, "data": audio_bytes}],
            generation_config={"response_mime_type": "application/json"}
        )
        extracted = json.loads(response.text)
        print("✅ Extraction Complete:", extracted)
    except Exception as exc:
        print(f"❌ Error: {exc}")
        raise HTTPException(status_code=500, detail=f"Gemini error: {exc}")

    deals_list = []
    web_results = []
    
    product_name = extracted.get("product_name")
    transcription = extracted.get("transcription")
    brand = extracted.get("brand") or ""
    
    is_valid_product = (
        product_name and 
        str(product_name).strip().lower() not in ["none", "null", ""] and
        brand and
        str(brand).strip().lower() not in ["none", "null", ""] and
        str(transcription).strip() != "SILENCE_DETECTED"
    )

    search_query = None
    uploaded_image_url = None
    if is_valid_product:
        search_query = f"{brand} {product_name}".strip()
    elif payload.image_b64:
        print("🔍 Gemini failed to extract product name. Triggering Google Lens fallback...")
        try:
            uploaded_image_url = upload_image_to_supabase(db, payload.image_b64, "image/jpeg")
            if uploaded_image_url:
                lens_params = {
                    "engine": "google_lens",
                    "url": uploaded_image_url,
                    "type": "products",
                    "api_key": SERP_API_KEY,
                    "hl": "en",
                    "gl": "in",
                    "location": "India"
                }
                res = requests.get("https://serpapi.com/search", params=lens_params, timeout=45)
                res.raise_for_status()
                lens_data = res.json()
                
                visual_matches = lens_data.get("visual_matches", [])
                if visual_matches:
                    top_matches = visual_matches[:10]
                    candidates = []
                    for i, item in enumerate(top_matches):
                        candidates.append(item.get("title"))
                        
                    lens_prompt = f"""
                    Analyze this screenshot and the list of Google Lens product match titles.
                    Provide ONLY a highly precise, optimized Google Shopping search query based on the most prominent product shown (e.g., 'Sony WH-1000XM5 Black').
                    Do not include any explanation, markdown, or extra text.
                    
                    Lens Titles:
                    {json.dumps(candidates, indent=2)}
                    """
                    
                    image_bytes = base64.b64decode(payload.image_b64)
                    print("🤖 Asking Gemini to extract a precise product name from Lens data...")
                    try:
                        filter_resp = model.generate_content(
                            [lens_prompt, {"mime_type": "image/jpeg", "data": image_bytes}]
                        )
                        fallback_product = filter_resp.text.strip()
                        if fallback_product:
                            extracted["product_name"] = fallback_product
                            search_query = fallback_product
                    except Exception as filter_exc:
                        print(f"⚠️ Gemini extraction failed: {filter_exc}")
        except Exception as exc:
            print(f"⚠️ SerpApi Google Lens error: {exc}")

    if search_query:
        print(f"🔍 Searching SerpApi for: {search_query}")
        
        try:
            shopping_params = {
                "engine": "google_shopping",
                "google_domain": "google.co.in",
                "q": search_query,
                "api_key": SERP_API_KEY,
                "hl": "en",
                "gl": "in",
                "location": "India"
            }
            res = requests.get("https://serpapi.com/search", params=shopping_params, timeout=45)
            res.raise_for_status()
            shopping_data = res.json()
            
            results = shopping_data.get("shopping_results", [])[:5]
            for item in results:
                deals_list.append({
                    "position": item.get("position"),
                    "product_link": item.get("product_link") or item.get("link"),
                    "immersive_product_page_token": item.get("immersive_product_page_token"),
                    "serpapi_immersive_product_api": item.get("serpapi_immersive_product_api"),
                    "source": item.get("source"),
                    "source_icon": item.get("source_icon"),
                    "price": item.get("price"),
                    "extracted_price": item.get("extracted_price"),
                    "rating": item.get("rating"),
                    "reviews": item.get("reviews"),
                    "thumbnail": item.get("serpapi_thumbnail") or item.get("thumbnail")
                })
        except Exception as exc:
            print(f"⚠️ SerpApi Shopping error: {exc}")

        try:
            web_params = {
                "engine": "google",
                "google_domain": "google.co.in",
                "q": search_query,
                "api_key": SERP_API_KEY,
                "hl": "en",
                "gl": "in",
                "location": "India"
            }
            res_web = requests.get("https://serpapi.com/search", params=web_params, timeout=45)
            res_web.raise_for_status()
            web_data = res_web.json()
            
            organic_results = web_data.get("organic_results", [])[:3]
            for item in organic_results:
                web_results.append({
                    "title": item.get("title"),
                    "snippet": item.get("snippet"),
                    "link": item.get("link")
                })
        except Exception as exc:
            print(f"⚠️ SerpApi Web error: {exc}")

    extracted["deals"] = deals_list
    extracted["web_results"] = web_results

    row = {
        "type": "video",
        "product_name": extracted.get("product_name"),
        "brand": extracted.get("brand"),
        "price": extracted.get("price"),
        "item_set": extracted.get("item_set", "Miscellaneous"),
        "url": None,
        "discount_active": False,
        "deals": deals_list if deals_list else None,
        "image_url": uploaded_image_url if uploaded_image_url else (deals_list[0].get("thumbnail") if deals_list and deals_list[0].get("thumbnail") else None)
    }

    try:
        print("\n📤 Pushing to Supabase:", json.dumps(row, indent=2, default=str))
        data = insert_stash_item(db, row)
        return {"status": "success", "extracted": extracted, "data": data}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"DB insert error: {exc}")


@app.post("/api/vision")
async def process_vision_lens_to_shopping(payload: VisionPayload):
    """
    Two-Step Engine: 
    1. Upload Image -> SerpApi Google Lens (Extract clean Title & Brand)
    2. SerpApi Google Shopping (Fetch rich localized prices/ratings) -> Supabase
    """
    db = get_supabase()

    # 0. STRIP THE BASE64 PREFIX
    clean_b64 = payload.image_b64
    if "," in clean_b64:
        clean_b64 = clean_b64.split(",")[1]

    try:
        base64.b64decode(clean_b64)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Base64 image data.")

    print("\n📸 Uploading image to Supabase Storage...")
    image_url = upload_image_to_supabase(db, clean_b64, payload.mime_type)
    
    if not image_url:
        raise HTTPException(status_code=500, detail="Failed to upload image to storage.")

    if not SERP_API_KEY:
        raise HTTPException(status_code=503, detail="SERP_API_KEY not configured in .env.")

    # =======================================================================
    # STEP 1: USE GOOGLE LENS TO GET TRACKABLE TITLE & BRAND
    # =======================================================================
    print(f"🔍 Executing Pass 1: Google Lens Identification...")
    
    lens_params = {
        "engine": "google_lens",
        "url": image_url,
        "api_key": SERP_API_KEY,
        "hl": "en",
        "gl": "in",
        "location": "India"
    }
    
    try:
        lens_res = requests.get("https://serpapi.com/search", params=lens_params, timeout=45)
        lens_res.raise_for_status()
        lens_data = lens_res.json()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"SerpApi Lens failure: {exc}")

    visual_matches = lens_data.get("visual_matches", [])
    if not visual_matches:
        raise HTTPException(status_code=404, detail="Google Lens could not visually identify any products in this image.")

    # Isolate the top match item details
    top_match = visual_matches[0]
    lens_title = top_match.get("title", "").strip()
    lens_brand = top_match.get("source", "").strip()
    
    # Construct a hyper-targeted marketplace query
    search_query = f"{lens_brand} {lens_title}".strip()
    print(f"🎯 Target Product Found: '{search_query}'")

    print("🤖 Classifying product into Master Category...")
    category_prompt = f"""
    Categorize the following product into EXACTLY ONE of these 10 master categories:
    - Electronics & Tech
    - Clothing & Apparel
    - Footwear
    - Home & Kitchen
    - Beauty & Wellness
    - Sports & Outdoors
    - Books & Media
    - Toys & Games
    - Groceries & Consumables
    - Miscellaneous
    
    Product: {search_query}
    
    Return ONLY the exact string of the category. No JSON, no markdown, just the string.
    """
    
    try:
        model = get_gemini()
        cat_resp = model.generate_content([category_prompt])
        item_set = cat_resp.text.strip()
        valid_cats = [
            "Electronics & Tech", "Clothing & Apparel", "Footwear", 
            "Home & Kitchen", "Beauty & Wellness", "Sports & Outdoors", 
            "Books & Media", "Toys & Games", "Groceries & Consumables", "Miscellaneous"
        ]
        if item_set not in valid_cats:
            item_set = "Miscellaneous"
    except Exception as exc:
        print(f"⚠️ Categorization failed: {exc}")
        item_set = "Miscellaneous"

    # =======================================================================
    # STEP 2: USE GOOGLE SHOPPING TO GET DEEP METRICS & LIVE DEALS
    # =======================================================================
    print(f"🛍️ Executing Pass 2: Google Shopping Live Deal Extraction...")
    deals_list = []
    
    shopping_params = {
        "engine": "google_shopping",
        "google_domain": "google.co.in",
        "q": search_query,
        "api_key": SERP_API_KEY,
        "hl": "en",
        "gl": "in",
        "location": "India"
    }
    
    try:
        shop_res = requests.get("https://serpapi.com/search", params=shopping_params, timeout=45)
        shop_res.raise_for_status()
        shopping_data = shop_res.json()
        shopping_results = shopping_data.get("shopping_results", [])[:3] # Grab top 3 rich deals
    except Exception as exc:
        print(f"⚠️ Shopping fallback triggered due to error: {exc}")
        shopping_results = []

    # Map the deep metrics from Google Shopping
    if shopping_results:
        for item in shopping_results:
            deals_list.append({
                "position": item.get("position"),
                "product_link": item.get("product_link") or item.get("link"),
                "immersive_product_page_token": item.get("immersive_product_page_token"),
                "serpapi_immersive_product_api": item.get("serpapi_immersive_product_api"),
                "source": item.get("source"),
                "source_icon": item.get("source_icon"),
                "price": item.get("price"),
                "extracted_price": item.get("extracted_price"),
                "rating": item.get("rating"),
                "reviews": item.get("reviews"),
                "thumbnail": item.get("serpapi_thumbnail") or item.get("thumbnail")
            })
    else:
        # Fallback straight to the raw Lens visual matches if Google Shopping returns an empty array
        print("⚠️ Shopping results empty. Extracting shallow data arrays from Pass 1...")
        backup_matches = [m for m in visual_matches if m.get("price")][:3]
        if not backup_matches:
            backup_matches = visual_matches[:3]
            
        for item in backup_matches:
            raw_price = item.get("price")
            extracted_val = raw_price.get("extracted_value") if isinstance(raw_price, dict) else None
            display_price = raw_price.get("value") if isinstance(raw_price, dict) else raw_price
            
            deals_list.append({
                "position": None,
                "product_link": item.get("link"),
                "immersive_product_page_token": None,
                "serpapi_immersive_product_api": None,
                "source": item.get("source"),
                "source_icon": item.get("source_icon"),
                "price": display_price or "View",
                "extracted_price": extracted_val,
                "rating": None,
                "reviews": None,
                "thumbnail": item.get("thumbnail")
            })

    # =======================================================================
    # STEP 3: DATABASE MUTATION SYNC
    # =======================================================================
    row = {
        "type": "screenshot",
        "product_name": lens_title if lens_title else search_query,
        "brand": lens_brand,
        "price": deals_list[0].get("extracted_price") if (deals_list and deals_list[0].get("extracted_price")) else None,
        "item_set": item_set,
        "url": None,
        "discount_active": False,
        "deals": deals_list,
        "image_url": image_url
    }

    try:
        print("\n📤 Pushing unified data profile to Supabase...")
        data = insert_stash_item(db, row)
        return {
            "status": "success", 
            "extracted": {
                "product_name": row["product_name"], 
                "brand": row["brand"], 
                "deals": deals_list
            }, 
            "data": data
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"DB sync mutation crash: {exc}")