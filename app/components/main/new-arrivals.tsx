import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Link } from "react-router";
import { books } from "~/lib/books-data";

export default function NewArrivals() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {books
        .filter((e) => e.isNew)
        .map((book) => (
          <Card
            key={book.id}
            className="overflow-hidden py-0 gap-0 flex flex-col h-full"
          >
            <div className="relative">
              <img
                src={book.coverImage || "/placeholder.svg"}
                alt={`Cover of ${book.title} by ${book.author}`}
                className="object-cover"
              />
              {book.isNew && (
                <Badge className="absolute top-2 right-2">New</Badge>
              )}
            </div>
            <CardContent className="pt-4 pb-4">
              <h3 className="font-semibold text-lg line-clamp-1">
                {book.title}
              </h3>
              <p className="text-muted-foreground">{book.author}</p>
              <p className="text-sm text-muted-foreground -mx-1 mt-1 truncate">
                {book.subjects.map((subject) => (
                  <Badge key={subject} className="m-1 ">
                    {subject}
                  </Badge>
                ))}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between pb-4">
              <Button className="ml-auto" variant="outline" size="sm" asChild>
                <Link to={`/catalog/book/${book.id}`}>Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  );
}
