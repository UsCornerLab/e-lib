// src/hooks/useNews.ts
import { useCallback, useState } from "react";
import type { NewsPost } from "~/services/newsService";
import {
  listNews,
  getNews,
  createNewsMultipart,
  updateNewsMultipart,
  deleteNews,
} from "~/services/newsService";

export function useNews() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState<any>(null);

  // Pagination state
  const [page, setPage] = useState<number>(1);

  // Helper: get token dynamically from localStorage
  const getToken = (): string => {
    if (typeof window !== "undefined")
      return localStorage.getItem("token") || "";
    return "";
  };

  // Fetch list of news (paginated)
  const fetchNews = useCallback(async (p: number = 1) => {
    const token = getToken();
    if (!token) {
      setError("No token found");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await listNews(token, p);
      const items = Array.isArray(data) ? data : data.data ?? data;
      setNews(items);
      setPageInfo(data);
      setPage(p);
    } catch (err: any) {
      setError(err.message || "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch a single news post by id
  const fetchOne = useCallback(async (id: number | string) => {
    const token = getToken();
    if (!token) throw new Error("No token");
    setLoading(true);
    setError(null);
    try {
      const item = await getNews(id, token);
      return item;
    } catch (err: any) {
      setError(err.message || "Failed to fetch news item");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a news post with FormData
  const create = useCallback(async (form: FormData) => {
    const token = getToken();
    if (!token) throw new Error("No token");
    setLoading(true);
    setError(null);
    try {
      const created = await createNewsMultipart(form, token);
      setNews((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || "Failed to create news");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update a news post by id with FormData
  const update = useCallback(async (id: number | string, form: FormData) => {
    const token = getToken();
    if (!token) throw new Error("No token");
    setLoading(true);
    setError(null);
    try {
      const updated = await updateNewsMultipart(id, form, token);
      setNews((prev) =>
        prev.map((n) => (n.id === (updated.id ?? id) ? updated : n))
      );
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update news");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a news post by id
  const remove = useCallback(async (id: number | string) => {
    const token = getToken();
    if (!token) throw new Error("No token");
    setLoading(true);
    setError(null);
    try {
      await deleteNews(id, token);
      setNews((prev) => prev.filter((n) => n.id !== Number(id)));
    } catch (err: any) {
      setError(err.message || "Failed to delete news");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    news,
    loading,
    error,
    pageInfo,
    page,
    setPage,
    fetchNews,
    fetchOne,
    create,
    update,
    remove,
  };
}

export type { NewsPost };
