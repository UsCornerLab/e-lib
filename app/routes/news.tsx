import { BookOpen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getAllArticles, getArticlesByCategory } from "~/lib/news-data";
import { Link } from "react-router";

export default function NewsPage() {
  const allArticles = getAllArticles();
  const categories = [
    "all",
    "events",
    "announcements",
    "programs",
    "resources",
    "community",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Library News & Updates
            </h1>
            <p className="text-muted-foreground">
              Stay informed about the latest events, programs, and announcements
              from your library.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => {
              const articles =
                category === "all"
                  ? allArticles
                  : getArticlesByCategory(category);

              return (
                <TabsContent key={category} value={category}>
                  {articles.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No articles found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        There are currently no articles in this category
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {articles.map((article) => (
                        <Card
                          key={article.id}
                          className="flex flex-col h-full overflow-hidden"
                        >
                          {article.featuredImage && (
                            <div className="relative h-48 w-full">
                              <img
                                src={
                                  article.featuredImage || "/placeholder.svg"
                                }
                                alt={article.imageAlt || article.title}
                                className="object-cover"
                              />
                            </div>
                          )}
                          <CardContent className="flex-1 pt-6">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="capitalize">
                                {article.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(
                                  article.publishedAt
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                              <Link
                                to={`/news/${article.id}`}
                                className="hover:text-primary transition-colors"
                              >
                                {article.title}
                              </Link>
                            </h3>
                            <p className="text-muted-foreground line-clamp-3 mb-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <span>{article.readingTime} min read</span>
                              {article.author && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>By {article.author}</span>
                                </>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button
                              variant="ghost"
                              className="p-0 h-auto"
                              asChild
                            >
                              <Link to={`/news/${article.id}`}>Read More</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
