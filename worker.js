/**
 * CLOUDFLARE WORKER API
 * ---------------------
 * Deploy this script to Cloudflare Workers to enable the "Roblox Raw Mode".
 * This allows loadstring(game:HttpGet("...")) to work by detecting the User-Agent.
 */

// Replace this with your frontend URL (e.g., GitHub Pages or Vercel URL)
const FRONTEND_URL = "https://your-frontend-url.com"; 

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const data = url.searchParams.get('data');
    const userAgent = request.headers.get('User-Agent') || "";

    // === ROBLOX ENVIRONMENT ===
    // If request comes from Roblox, decode the data and serve RAW TEXT.
    if (data && (userAgent.includes("Roblox") || userAgent.includes("RobloxApp"))) {
      try {
        // Decode Base64 > URI Component > JSON > Code
        // Note: Logic matches 'utils/crypto.ts' but simplified for Worker
        const jsonString = decodeURIComponent(atob(data));
        const payload = JSON.parse(jsonString);
        
        return new Response(payload.code, {
          headers: { 
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-cache"
          }
        });
      } catch (e) {
        return new Response("-- Error: Invalid SecureRaw Payload", { status: 400 });
      }
    }

    // === BROWSER ENVIRONMENT ===
    // Forward the request to your static frontend.
    // The frontend will see the ?data= param and render the Password Screen.
    // We fetch the original index.html from your host.
    
    // Note: If you are serving this worker on the SAME domain as the frontend, 
    // you might need to fetch from the asset source directly.
    
    const response = await fetch(FRONTEND_URL + url.search, request);
    return response;
  }
};
