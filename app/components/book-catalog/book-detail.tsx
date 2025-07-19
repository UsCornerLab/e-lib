import {
  ArrowLeft,
  BookOpen,
  Calendar,
  FileText,
  Globe,
  Hash,
  Bookmark,
  CheckCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { books } from "~/lib/books-data";
import { Link } from "react-router";

interface BookPageProps {
  params: {
    id: string;
  };
}

export default function BookPage({ params }: BookPageProps) {
  const book = books.find((book) => book.id === params.id);

  if (!book) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold">Book Not Found</h1>
        <p className="text-muted-foreground">
          The book you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/catalog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Link>
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] bg-muted rounded-lg overflow-hidden">
              <img
                src={book.coverImage || "/placeholder.svg"}
                alt={`Cover of ${book.title} by ${book.author}`}
                className="object-cover"
              />
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <Button className="w-full" disabled={!book.available}>
                  {book.available ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Reserve
                    </>
                  ) : (
                    <>
                      <Bookmark className="mr-2 h-4 w-4" />
                      Place Hold
                    </>
                  )}
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Availability</h3>
                <div className="space-y-2">
                  {book.available ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Checked Out</Badge>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    {book.formats.includes("print") && (
                      <Badge variant="outline">Print</Badge>
                    )}
                    {book.formats.includes("ebook") && (
                      <Badge variant="outline">E-Book</Badge>
                    )}
                    {book.formats.includes("audiobook") && (
                      <Badge variant="outline">Audiobook</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              by {book.author}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {book.subjects.map((subject) => (
                <Link key={subject} to={`/catalog?filters=genre:${subject}`}>
                  <Badge variant="secondary">{subject}</Badge>
                </Link>
              ))}
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-lg">{book.description}</p>
            </div>

            <Separator className="my-6" />

            <h2 className="text-xl font-semibold mb-4">Book Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Publication Year</h3>
                  <p>{book.year}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Hash className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">ISBN</h3>
                  <p>{book.isbn}</p>
                </div>
              </div>

              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Pages</h3>
                  <p>{book.pages}</p>
                </div>
              </div>

              <div className="flex items-start">
                <BookOpen className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Publisher</h3>
                  <p>{book.publisher}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Globe className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Language</h3>
                  <p>{book.language}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button variant="outline" asChild>
                <Link to="/catalog">Browse More Books</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="#" onClick={(e) => e.preventDefault()}>
                  Add to Reading List
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="#" onClick={(e) => e.preventDefault()}>
                  Share
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
