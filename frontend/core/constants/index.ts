const raw = process.env.NEXT_PUBLIC_API_URL;
// Ensure a valid base URL (avoid "Failed to construct 'URL': Invalid URL")
export const API_URL =
  raw && raw.trim() !== ""
    ? raw.replace(/\/$/, "") + "/"
    : typeof window !== "undefined"
      ? `${window.location.origin}/api/`
      : "http://localhost:4000/";
