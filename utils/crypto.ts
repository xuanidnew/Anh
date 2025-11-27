import { RawPayload } from '../types';

export const encodePayload = (payload: RawPayload): string => {
  try {
    const jsonString = JSON.stringify(payload);
    const base64 = btoa(encodeURIComponent(jsonString));
    
    // Make URL Safe for path usage:
    // Replace '+' with '-'
    // Replace '/' with '_'
    // Remove '=' padding
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error("Encoding error", e);
    return "";
  }
};

export const decodePayload = (safeBase64: string): RawPayload | null => {
  try {
    if (!safeBase64) return null;
    
    let cleanString = safeBase64.replace(/^\?data=/, '');
    
    // Restore Standard Base64:
    // Replace '-' with '+'
    // Replace '_' with '/'
    cleanString = cleanString.replace(/-/g, '+').replace(/_/g, '/');
    
    // Restore padding if needed (Base64 length must be multiple of 4)
    while (cleanString.length % 4) {
      cleanString += '=';
    }

    const decodedString = decodeURIComponent(atob(cleanString));
    return JSON.parse(decodedString) as RawPayload;
  } catch (e) {
    console.error("Decoding error", e);
    return null;
  }
};

export const getPayloadFromUrl = (): RawPayload | null => {
  // Check Query Params (Returned from API Redirect)
  const params = new URLSearchParams(window.location.search);
  const dataParam = params.get('data');
  
  if (dataParam) {
    return decodePayload(dataParam);
  }
  
  return null;
};

export const isRobloxEnvironment = (): boolean => {
  const ua = navigator.userAgent;
  return ua.includes("Roblox") || ua.includes("RobloxApp");
};