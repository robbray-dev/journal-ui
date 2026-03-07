import { supabase } from "../lib/supabase";

const BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Returns Authorization header with Supabase JWT
 */
async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error("No active session");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * Generic authenticated fetch
 */
export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  // ✅ If no content, return null
  if (response.status === 204) return null;

  // ✅ If response body is empty, return null
  const text = await response.text();
  if (!text) return null;

  // ✅ Try JSON, otherwise return raw text
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
