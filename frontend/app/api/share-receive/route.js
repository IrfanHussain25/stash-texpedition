import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // 1. Catch the FormData sent by the phone's native share menu
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.redirect(new URL('/?error=NoImage', request.url));
    }

    // 2. Convert the File to a Base64 string for the Python backend
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // 3. Send it to the Antigravity Python Engine
    // IMPORTANT: Replace this with your Python Ngrok URL
    const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL + '/api/vision'; 

    // Fire and forget (don't await) so the UI redirects instantly while Python thinks
    fetch(pythonBackendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        image_b64: base64String,
        mime_type: file.type
      })
    }).catch(e => console.error("Python backend error:", e));

    // 4. Immediately redirect the user back to the main dashboard
    // Since Supabase Realtime is running, the new card will slide in automatically!
    return NextResponse.redirect(new URL('/', request.url));

  } catch (error) {
    console.error("Share target error:", error);
    return NextResponse.redirect(new URL('/?error=ShareFailed', request.url));
  }
}