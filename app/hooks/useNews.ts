// src/hooks/useNews.ts
import { useCallback, useEffect, useState } from "react";
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
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setToken(t);
  }, []);

  const fetchNews = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);
        const data = await listNews(token || undefined, page);
        // If server returned paginator shape {data: [...], meta:...} or standard Laravel
        const items = Array.isArray(data) ? data : data.data ?? data;
        setNews(items);
        setPageInfo(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const fetchOne = useCallback(
    async (id: number | string) => {
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
    },
    [token]
  );

  const create = useCallback(
    async (form: FormData) => {
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
    },
    [token]
  );

  const update = useCallback(
    async (id: number | string, form: FormData) => {
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
    },
    [token]
  );

  const remove = useCallback(
    async (id: number | string) => {
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
    },
    [token]
  );

  // auto-fetch first page when token available
  useEffect(() => {
    if (token) fetchNews(1);
  }, [token, fetchNews]);

  return {
    news,
    loading,
    error,
    pageInfo,
    fetchNews,
    fetchOne,
    create,
    update,
    remove,
  };
}
