// app/routes/news/$id.tsx
import type React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { useNews } from "~/hooks/useNews";

export default function NewsViewPage() {
  const { id } = useParams();
  const newsId = Number(id);
  const { fetchOne } = useNews();

  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!newsId) return;
    (async () => {
      setLoading(true);
      try {
        const n = await fetchOne(newsId);
        setItem(n);
      } catch (err: any) {
        console.error("Failed to load news:", err);
        alert(err?.message || "Failed to load news");
      } finally {
        setLoading(false);
      }
    })();
  }, [newsId, fetchOne]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!item) return <div className="p-6">Article not found</div>;

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{item.title}</h1>
        <div className="text-sm text-muted-foreground">
          {item.published_at
            ? new Date(item.published_at).toLocaleString()
            : "Not published"}
        </div>
      </div>

      {item.featured_image && (
        <div className="mb-6">
          <img
            src={item.featured_image}
            alt={item.title}
            className="w-full rounded-lg object-cover aspect-video"
          />
        </div>
      )}

      {item.excerpt && (
        <p className="mb-4 text-lg text-muted-foreground">{item.excerpt}</p>
      )}

      <article className="prose max-w-none">
        {/* content is a string. If it's HTML you can dangerouslySetInnerHTML. Otherwise render as paragraphs. */}
        {typeof item.content === "string" ? (
          item.content.includes("<") ? (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : (
            item.content
              .split("\n")
              .map((p: string, i: number) => <p key={i}>{p}</p>)
          )
        ) : (
          <pre>{JSON.stringify(item.content, null, 2)}</pre>
        )}
      </article>

      <div className="mt-8">
        <Link to="/admin/news">
          <Button variant="outline">Back to News</Button>
        </Link>
      </div>
    </main>
  );
}
