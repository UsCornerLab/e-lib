// routes/admin/news/index.tsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { useNews } from "../../../hooks/useNews";
import type { NewsPost } from "~/services/newsService";
export default function NewsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const {
    news,
    loading,
    error,
    fetchNews,
    fetchOne,
    create,
    update,
    remove,
    pageInfo, // paginator object from the hook/service (if available)
  } = useNews();

  // local page state (falls back to pageInfo.current_page)
  const [page, setPage] = useState<number>(1);

  // debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // fetch news for current page
  useEffect(() => {
    fetchNews(page);
  }, [fetchNews, page]);

  // when pageInfo updates, ensure local page sync
  useEffect(() => {
    if (pageInfo && typeof pageInfo.current_page === "number") {
      setPage(pageInfo.current_page);
    }
  }, [pageInfo]);

  // client-side filtering on the loaded page
  const filtered = news.filter((n) =>
    [n.title, n.excerpt, n.content ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this news post?")) return;
    try {
      await remove(id);
      // refetch current page to keep list consistent
      fetchNews(page);
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err?.message || "Failed to delete news post");
    }
  };

  const handlePrev = () => {
    if (!pageInfo) return;
    if (pageInfo.current_page > 1) setPage(pageInfo.current_page - 1);
  };

  const handleNext = () => {
    if (!pageInfo) return;
    if (pageInfo.current_page < pageInfo.last_page)
      setPage(pageInfo.current_page + 1);
  };

  const gotoPage = (p: number) => {
    if (!pageInfo) return;
    const pageNum = Math.max(1, Math.min(p, pageInfo.last_page));
    setPage(pageNum);
  };

  const getPages = () => {
    if (!pageInfo) return [];
    const current = pageInfo.current_page;
    const last = pageInfo.last_page;
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, current - delta);
      i <= Math.min(last, current + delta);
      i++
    ) {
      range.push(i);
    }
    if (range[0] !== 1) range.unshift(1);
    if (range[range.length - 1] !== last) range.push(last);
    return Array.from(new Set(range));
  };

  if (loading) return <div className="p-6">Loading news...</div>;
  if (error) return <div className="p-6 text-destructive">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">News Management</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news by title or excerpt..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/news/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add News
            </Button>
          </Link>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Excerpt</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No news found
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((item: NewsPost) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    {/* Featured image rectangle */}
                    <div className="w-16 h-10 overflow-hidden rounded-md bg-gray-100">
                      <img
                        src={item.featured_image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="font-medium">{item.title}</div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {item.excerpt
                    ? item.excerpt
                    : item.content?.slice(0, 120) +
                      (item.content && item.content.length > 120 ? "…" : "")}
                </TableCell>
                <TableCell>
                  {item.published_at
                    ? new Date(item.published_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={item.is_published ? "default" : "secondary"}>
                    {item.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>

                      <DropdownMenuItem asChild>
                        <Link to={`/admin/news/${item.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {pageInfo && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">
            Showing {pageInfo.from ?? 0} - {pageInfo.to ?? 0} of{" "}
            {pageInfo.total}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={pageInfo.current_page === 1}
            >
              <ChevronLeft />
            </Button>

            {getPages().map((p, idx) => (
              <Button
                key={p + "-" + idx}
                variant={p === pageInfo.current_page ? "default" : "ghost"}
                size="sm"
                onClick={() => gotoPage(p)}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={pageInfo.current_page === pageInfo.last_page}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
