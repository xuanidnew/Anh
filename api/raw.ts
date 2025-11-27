/**
 * VERCEL SERVERLESS FUNCTION
 * Path: /api/raw
 * 
 * This acts as the middleware.
 * 1. Receives request with ?data=PAYLOAD (Rewrite rule sends path /api/raw/PAYLOAD here)
 * 2. Checks User-Agent
 * 3. If Roblox -> Decodes and returns Raw Text
 * 4. If Browser -> Redirects to Frontend UI for Password check
 */

// We use 'any' types here to avoid needing @vercel/node dependency
export default function handler(request: any, response: any) {
  const { data } = request.query;
  const userAgent = request.headers['user-agent'] || '';

  if (!data) {
    return response.status(400).send('Missing data parameter');
  }

  // --- 1. ENVIRONMENT DETECTION (ROBLOX) ---
  const isRoblox = 
    userAgent.includes('Roblox') || 
    userAgent.includes('RobloxApp') || 
    userAgent.includes('RobloxStudio');

  // Helper to decode safe-url-base64
  const decodePayload = (safeBase64: string) => {
    try {
      // Restore Standard Base64 from URL Safe variant
      // Replace '-' with '+'
      // Replace '_' with '/'
      let base64 = safeBase64.replace(/-/g, '+').replace(/_/g, '/');
      
      // Fix padding
      while (base64.length % 4) {
        base64 += '=';
      }

      // Decode
      const decodedURI = atob(base64);
      const json = decodeURIComponent(decodedURI);
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  // --- 2. LOGIC ---
  if (isRoblox) {
    // ROBOT/GAME ACCESS: Decrypt and serve RAW content
    const payloadStr = Array.isArray(data) ? data[0] : data;
    const payload = decodePayload(payloadStr);
    
    if (payload && payload.code) {
      // Return plain text for loadstring()
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return response.status(200).send(payload.code);
    } else {
      return response.status(500).send('-- Error: Invalid Payload or Decryption Failed');
    }
  } else {
    // BROWSER/HUMAN ACCESS: Security Redirect
    // Redirect the user back to the main frontend to input password.
    
    const protocol = request.headers['x-forwarded-proto'] || 'https';
    const host = request.headers['host'];
    const baseUrl = `${protocol}://${host}`;
    
    // Redirect to root with data query param. 
    // The frontend's decodePayload matches the URL-safe format we pass here.
    return response.redirect(307, `${baseUrl}/?data=${data}`);
  }
}