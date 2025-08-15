import { Link, useSearchParams } from "react-router";
import { BookOpen, Bookmark, CheckCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Pagination } from "~/components/book-catalog/pagination";

// Sample book data
import { books } from "~/lib/books-data";

export function BookCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "relevance";
  const filters = searchParams.get("filters")?.split(",") || [];

  // Filter books based on search query and filters
  const filteredBooks = books.filter((book) => {
    // Search query filter
    if (query) {
      const searchLower = query.toLowerCase();
      const matchesTitle = book.title.toLowerCase().includes(searchLower);
      const matchesAuthor = book.author.toLowerCase().includes(searchLower);
      const matchesSubject = book.subjects.some((subject) =>
        subject.toLowerCase().includes(searchLower)
      );

      if (!(matchesTitle || matchesAuthor || matchesSubject)) {
        return false;
      }
    }

    // Apply active filters
    if (filters.length > 0) {
      for (const filter of filters) {
        const [category, value] = filter.split(":");

        switch (category) {
          case "format":
            if (!book.formats.includes(value)) return false;
            break;
          case "genre":
            if (!book.subjects.includes(value)) return false;
            break;
          case "availability":
            if (value === "available" && !book.available) return false;
            if (
              value === "digital" &&
              !book.formats.includes("ebook") &&
              !book.formats.includes("audiobook")
            )
              return false;
            break;
          case "year": {
            const year = book.year;
            if (value === "2020s" && year < 2020) return false;
            if (value === "2010s" && (year < 2010 || year >= 2020))
              return false;
            if (value === "2000s" && (year < 2000 || year >= 2010))
              return false;
            if (value === "older" && year >= 2000) return false;
            break;
          }
        }
      }
    }

    return true;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sort) {
      case "title_asc":
        return a.title.localeCompare(b.title);
      case "title_desc":
        return b.title.localeCompare(a.title);
      case "author_asc":
        return a.author.localeCompare(b.author);
      case "author_desc":
        return b.author.localeCompare(a.author);
      case "year_desc":
        return b.year - a.year;
      case "year_asc":
        return a.year - b.year;
      default:
        // Relevance - keep original order or implement relevance algorithm
        return 0;
    }
  });

  // Pagination
  const booksPerPage = 12;
  const totalBooks = sortedBooks.length;
  const totalPages = Math.ceil(totalBooks / booksPerPage);
  const currentPageBooks = sortedBooks.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {currentPageBooks.length} of {totalBooks} books
        </p>
      </div>

      {totalBooks === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No books found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" asChild>
            <Link to="/catalog">Clear all filters</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentPageBooks.map((book) => (
              <Card
                key={book.id}
                className="gap-0 flex flex-col h-full overflow-hidden py-0"
              >
                <div className="relative  bg-muted">
                  <img
                    src={book.coverImage || "/placeholder.svg"}
                    alt={`Cover of ${book.title} by ${book.author}`}
                    className="object-cover"
                  />
                  {book.formats.includes("ebook") && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">E-Book</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 py-4">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground">{book.author}</p>
                  <p className="mt-2 text-sm line-clamp-2">
                    {book.description}
                  </p>
                </CardContent>
                <CardFooter className="pb-4">
                  <div className="w-full flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                      asChild
                    >
                      <Link to={`/book/${book.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} />
          )}
        </>
      )}
    </div>
  );
}
