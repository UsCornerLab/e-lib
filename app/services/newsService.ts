// src/services/newsService.ts
export interface NewsPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string; // we'll store JSON string (client will stringify)
  featured_image?: string | null;
  is_published: boolean;
  published_at?: string | null;
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;
  // any other fields your backend produces
}

const API_BASE = "http://127.0.0.1:8000/api/news";

// JSON header builder (for non-file endpoints)
const buildJsonHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Helper: build only Authorization header (for multipart)
const buildAuthOnlyHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export async function fetchLandingNews(limit = 3): Promise<NewsPost[]> {
  const res = await fetch(`${API_BASE}/landing?limit=${limit}`, {
    method: "GET",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch landing news: ${res.status} ${text}`);
  }
  const payload = await res.json();
  return payload.data ?? [];
}

export async function listNews(
  token?: string,
  page = 1
): Promise<{ data: NewsPost[]; meta?: any }> {
  const url = `${API_BASE}?page=${page}`;
  const res = await fetch(url, {
    headers: token ? buildAuthOnlyHeader(token) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch news");
  }
  const data = await res.json();
  // Laravel paginator returns object with 'data' array; keep this shape
  return data;
}

export async function getNews(
  id: number | string,
  token?: string
): Promise<NewsPost> {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: token ? buildAuthOnlyHeader(token) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch news");
  }
  const data = await res.json();
  return data;
}

/**
 * Create a news post with FormData (handles featured_image file)
 * Backend expects:
 *  - title, slug, excerpt, content (string), is_published (boolean), published_at (nullable date), featured_image (file)
 */
export async function createNewsMultipart(
  form: FormData,
  token: string
): Promise<NewsPost> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: buildAuthOnlyHeader(token), // do NOT set Content-Type
    body: form,
  });
  const data = await res.json();
  if (!res.ok || data.status === false) {
    throw new Error(data.message || "Failed to create news post");
  }
  // controller returns 'News'
  return data.News || data;
}

/**
 * Update news post by id with FormData (files allowed)
 */
export async function updateNewsMultipart(
  id: number | string,
  form: FormData,
  token: string
): Promise<NewsPost> {
  form.append("_method", "PUT"); // trick Laravel to treat POST as PUT

  const res = await fetch(`${API_BASE}/${id}`, {
    method: "POST", // must be POST for FormData
    headers: buildAuthOnlyHeader(token), // do NOT set Content-Type
    body: form,
  });

  const data = await res.json();
  if (!res.ok || data.status === false) {
    throw new Error(data.message || "Failed to update news post");
  }
  return data.News || data;
}


/**
 * Delete a news post
 */
export async function deleteNews(
  id: number | string,
  token: string
): Promise<boolean> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: buildAuthOnlyHeader(token),
  });
  const data = await res.json();
  if (!res.ok || data.status === false)
    throw new Error(data.message || "Failed to delete news");
  return true;
}
