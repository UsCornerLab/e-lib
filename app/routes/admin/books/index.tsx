// routes/books/index.tsx
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import Barcode from "react-barcode";
import { useBooks, type Book } from "../../../hooks/useBooks";
import RequireAuth from "~/components/auth/RequireAuth";

export default function BooksManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [barcodeBook, setBarcodeBook] = useState<Book | null>(null);
  const barcodeRef = useRef<HTMLDivElement>(null);

  // pagination controls local state (defaults)
  const [localPerPage, setLocalPerPage] = useState<number>(10);

  // Use our custom hook
  const {
    books,
    loading,
    error,
    fetchBooks,
    deleteBook,
    pagination,
    page,
    perPage,
    setPage,
    setPerPage,
  } = useBooks();

  // Debounce search input (500ms)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 500);
    return () => clearTimeout(id);
  }, [searchQuery]);

  // Fetch books when page/perPage/debouncedSearch change
  useEffect(() => {
    // synchronize hook perPage when localPerPage changes
    fetchBooks(page || 1, localPerPage, debouncedSearch);
  }, [fetchBooks, page, localPerPage, debouncedSearch]);

  // Keep hook-perPage in sync with localPerPage
  useEffect(() => {
    setPerPage(localPerPage);
  }, [localPerPage, setPerPage]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      await deleteBook(id);
    }
  };

  const handleDownloadBarcode = () => {
    if (!barcodeRef.current || !barcodeBook) return;
    const svg = barcodeRef.current.querySelector("svg");
    if (!svg) return;

    const xml = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${barcodeBook.title || "book"}-barcode.png`;
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(xml);
  };

  if (loading) return <div className="p-6">Loading books...</div>;
  if (error) return <div className="p-6 text-destructive">Error: {error}</div>;

  const handlePrev = () => {
    if (!pagination) return;
    if (pagination.current_page > 1) {
      setPage(pagination.current_page - 1);
    }
  };

  const handleNext = () => {
    if (!pagination) return;
    if (pagination.current_page < pagination.last_page) {
      setPage(pagination.current_page + 1);
    }
  };

  const gotoPage = (p: number) => {
    if (!pagination) return;
    const pageNum = Math.max(1, Math.min(p, pagination.last_page));
    setPage(pageNum);
  };

  const getPages = () => {
    if (!pagination) return [];
    const current = pagination.current_page;
    const last = pagination.last_page;
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, current - delta);
      i <= Math.min(last, current + delta);
      i++
    ) {
      range.push(i);
    }
    // if first or last not included, consider adding them for quick jump (simpler approach)
    if (range[0] !== 1) range.unshift(1);
    if (range[range.length - 1] !== last) range.push(last);
    return Array.from(new Set(range));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Books Management</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // reset to first page on new query
              setPage(1);
            }}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm">Per page:</label>
          <select
            value={localPerPage}
            onChange={(e) => {
              const v = Number(e.target.value);
              setLocalPerPage(v);
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <Link to="/admin/books/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </Link>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No books found
              </TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell className="font-mono text-sm">{book.ISBN}</TableCell>
                <TableCell>
                  {new Date(book.publication_date).getFullYear()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      book.available_copies && book.available_copies > 0
                        ? "default"
                        : "destructive"
                    }
                  >
                    {book.available_copies && book.available_copies > 0
                      ? "Available"
                      : "Checked Out"}
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
                        <Link to={`/book/${book.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/books/${book.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button
                          variant="secondary"
                          onClick={() => setBarcodeBook(book)}
                        >
                          View Barcode
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(book.id)}
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

      {/* Pagination controls */}
      {pagination && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">
            Showing {pagination.from ?? 0} - {pagination.to ?? 0} of{" "}
            {pagination.total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={pagination.current_page === 1}
            >
              <ChevronLeft />
            </Button>

            {getPages().map((p, idx) => (
              <Button
                key={p + "-" + idx}
                variant={p === pagination.current_page ? "default" : "ghost"}
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
              disabled={pagination.current_page === pagination.last_page}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!barcodeBook} onOpenChange={() => setBarcodeBook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Barcode</DialogTitle>
          </DialogHeader>
          {barcodeBook && (
            <div className="flex flex-col items-center">
              <div ref={barcodeRef}>
                <Barcode
                  value={barcodeBook.ISBN}
                  format="CODE128"
                  width={2}
                  height={100}
                  displayValue={true}
                />
              </div>
              <Button className="mt-4" onClick={handleDownloadBarcode}>
                Download Barcode
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
