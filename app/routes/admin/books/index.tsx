import { useState, useRef ,useEffect} from "react" 
import { Link } from "react-router" 
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, QrCode } from "lucide-react" 
import { Button } from "~/components/ui/button" 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card" 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table" 
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, } from "~/components/ui/dropdown-menu" 
import { Badge } from "~/components/ui/badge" 
import { books } from "~/lib/books-data" 
import { Input } from "~/components/ui/input" 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog"
import { useBooks } from "../../../hooks/useBooks"
import type { BookPayload } from "../../../services/bookService"
import Barcode from "react-barcode"

export default function BooksManagement() {
  const { books, fetchBooks, removeBook } = useBooks()
  const [searchQuery, setSearchQuery] = useState("");

  const [barcodeBook, setBarcodeBook] = useState<any>(null)
  const barcodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])
  const filteredBooks = books.filter(
  (book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.ISBN.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.authors?.some(a => a.author_name.toLowerCase().includes(searchQuery.toLowerCase()))
);

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      removeBook(id)
    }
  }

  const handleDownloadBarcode = () => {
    if (!barcodeRef.current) return
    const svg = barcodeRef.current.querySelector("svg")
    if (!svg) return

    const xml = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const url = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = url
      link.download = `${barcodeBook?.title || "book"}-barcode.png`
      link.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(xml)
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Books Management</h1>
      <div className="flex justify-between items-center mb-4">
  <div className="relative flex-1">
    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search books by title, author, or ISBN..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-8"
    />
  </div>
  <Link to="/admin/books/new">
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Book
    </Button>
  </Link>
</div>

     <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Title</TableHead>
      {/* <TableHead>Author(s)</TableHead> */}
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

        {/* Map authors array to a comma-separated string
        <TableCell>
          {book.authors?.map((a: any) => a.author_name).join(", ") || "N/A"}
        </TableCell> */}

        <TableCell className="font-mono text-sm">{book.ISBN}</TableCell>

        {/* Format publication date to just the year */}
        <TableCell>
          {new Date(book.publication_date).getFullYear()}
        </TableCell>

        <TableCell>
          <Badge variant={book.copies > 0 ? "default" : "destructive"}>
            {book.copies > 0 ? "Available" : "Checked Out"}
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
    ))}
  </TableBody>
</Table>

      {/* Barcode Dialog */}
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
  )
}
