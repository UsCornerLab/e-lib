// src/components/NewsSection.tsx
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { useLandingNews } from "~/hooks/useLandingNews";
import { format } from "date-fns"; // optional - if you want to format dates (install date-fns) or use vanilla

export default function NewsSection({ limit = 3 }: { limit?: number }) {
  const { items, loading, error } = useLandingNews(limit);

  const formatDate = (iso?: string | null) => {
    if (!iso) return "";
    try {
      // simple formatting - you can replace with date-fns or dayjs
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  if (loading) {
    // simple skeleton UI — show empty cards
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <Card key={i} className="overflow-hidden gap-0 py-0 animate-pulse">
            <div className="relative h-40 bg-gray-200" />
            <CardContent className="py-4">
              <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-full bg-gray-100 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-100 rounded" />
            </CardContent>
            <CardFooter className="flex justify-between pb-4">
              <Button variant="outline" className="w-full" disabled>
                Loading...
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive">Error loading news: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden gap-0 py-0">
          <div className="relative h-40">
            <img
              src={item.featured_image ?? "/placeholder.svg"}
              alt={item.title ?? ""}
              className="w-full h-full object-cover"
            />
          </div>

          <CardContent className="py-4">
            <div className="text-sm text-muted-foreground mb-2">
              {formatDate(item.published_at)}
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm">
              {item.excerpt ??
                (item.content
                  ? item.content.slice(0, 140) +
                    (item.content.length > 140 ? "…" : "")
                  : "")}
            </p>
          </CardContent>

          <CardFooter className="flex justify-between pb-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to={`/news/${item.slug ?? item.id}`}>Read More</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
