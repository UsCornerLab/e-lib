import { useState } from "react";
import { Link } from "react-router";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import Barcode from "react-barcode";
import { books } from "~/lib/books-data";
import { Input } from "~/components/ui/input";

export default function BooksManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [selectedBook, setSelectedBook] = useState<(typeof books)[0] | null>(
    null
  );
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.isbn.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleDelete = (bookId: string) => {
    console.log("Delete book:", bookId);
    setFilteredBooks(filteredBooks.filter((book) => book.id !== bookId));
  };

  const handleShowBarcode = (book: (typeof books)[0]) => {
    setSelectedBook(book);
    setIsBarcodeModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Books Management</h1>
          <p className="text-muted-foreground">
            Manage your library's book collection
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/books/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </div>

      {/* Book Table */}
      <Card>
        <CardHeader>
          <CardTitle>Book Collection</CardTitle>
          <CardDescription>
            {filteredBooks.length} books in the collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {book.isbn}
                    </TableCell>
                    <TableCell>{book.year}</TableCell>
                    <TableCell>
                      <Badge
                        variant={book.available ? "default" : "destructive"}
                      >
                        {book.available ? "Available" : "Checked Out"}
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
                            <Link to={`/catalog/book/${book.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/books/${book.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleShowBarcode(book)}
                          >
                            <svg
                              className="mr-2 h-4 w-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M2 5h2v14H2zm4 0h2v14H6zm3 0h1v14H9zm2 0h2v14h-2zm3 0h1v14h-1zm2 0h2v14h-2zm3 0h1v14h-1z" />
                            </svg>
                            Show Barcode
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Barcode Modal */}
      <Dialog open={isBarcodeModalOpen} onOpenChange={setIsBarcodeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Barcode</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="flex flex-col items-center gap-4 p-4 bg-white border rounded">
              <Barcode
                value={JSON.stringify({
                  title: selectedBook.title,
                  isbn: selectedBook.isbn,
                })}
                format="CODE128"
                width={1}
                height={80}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
