// src/hooks/useLandingNews.ts
import { useEffect, useState } from "react";
import type { NewsPost } from "~/services/newsService";
import { fetchLandingNews } from "~/services/newsService";

export function useLandingNews(limit = 3) {
  const [items, setItems] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchLandingNews(limit)
      .then((data) => {
        if (!mounted) return;
        setItems(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load news");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [limit]);

  return { items, loading, error };
}
