import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

// Sample data for library news
const newsItems = [
  {
    id: 1,
    title: "Summer Reading Program Kicks Off Next Month",
    excerpt:
      "Join our annual summer reading program with prizes, events, and activities for all ages.",
    date: "May 28, 2023",
    image: "https://placehold.co/600x400",
  },
  {
    id: 2,
    title: "Library Renovation Project Completed",
    excerpt:
      "Our west wing renovation is complete, featuring new study rooms and improved accessibility.",
    date: "May 15, 2023",
    image: "https://placehold.co/600x400",
  },
  {
    id: 3,
    title: "New Digital Resources Available",
    excerpt:
      "We've added new e-books, audiobooks, and online learning resources to our digital collection.",
    date: "May 10, 2023",
    image: "https://placehold.co/600x400",
  },
];

export default function NewsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {newsItems.map((item) => (
        <Card key={item.id} className="overflow-hidden gap-0 py-0">
          <div className="relative">
            <img
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              className="object-cover"
            />
          </div>
          <CardContent className="py-4">
            <div className="text-sm text-muted-foreground mb-2">
              {item.date}
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm">{item.excerpt}</p>
          </CardContent>
          <CardFooter className="flex justify-between pb-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to={`/news/${item.id}`}>Read More</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
