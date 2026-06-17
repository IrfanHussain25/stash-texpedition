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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const pythonBackendUrl = baseUrl + '/api/vision';

    // Await the fetch so Next.js doesn't kill the background task when the response returns
    console.log("Sending image to Python backend...");
    const pythonResponse = await fetch(pythonBackendUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ 
        image_b64: base64String,
        mime_type: file.type
      })
    });
    
    if (!pythonResponse.ok) {
      console.error("Python backend returned error:", await pythonResponse.text());
    } else {
      console.log("Python backend processed image successfully!");
    }

    // 4. Immediately redirect the user back to the main dashboard
    // Use headers to handle Ngrok proxies correctly
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const redirectBaseUrl = `${protocol}://${host}`;
    
    return NextResponse.redirect(new URL('/', redirectBaseUrl), 303);

  } catch (error) {
    console.error("Share target error:", error);
    
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    return NextResponse.redirect(new URL('/?error=ShareFailed', `${protocol}://${host}`), 303);
  }
}