import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { getArticleById, getRelatedArticles } from "~/lib/news-data";
import { ArticleAuthor } from "~/components/news/article-author";
import { ShareButtons } from "~/components/news/share-buttons";
import { Link } from "react-router";

interface NewsArticlePageProps {
  params: {
    id: string;
  };
}

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  const article = getArticleById(params.id);

  if (!article) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold">Article Not Found</h1>
        <p className="text-muted-foreground">
          The article you are looking for does not exist.
        </p>
      </div>
    );
  }

  const relatedArticles = getRelatedArticles(article.id, article.category);

  return (
    <div className="min-h-screen bg-background px-12">
      <div className="container py-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link to="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <article>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge>{article.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {article.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </div>
                  {article.author && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{article.author}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{article.readingTime} min read</span>
                  </div>
                </div>
              </div>

              {article.featuredImage && (
                <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                  <img
                    src={article.featuredImage || "/placeholder.svg"}
                    alt={article.imageAlt || article.title}
                    className="object-cover"
                  />
                  {article.imageCaption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                      {article.imageCaption}
                    </div>
                  )}
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                {article.content.map((section, index) => {
                  if (section.type === "paragraph") {
                    return <p key={index}>{section.content}</p>;
                  } else if (section.type === "heading") {
                    return (
                      <h2 key={index} className="text-2xl font-bold mt-8 mb-4">
                        {section.content}
                      </h2>
                    );
                  } else if (section.type === "image") {
                    return (
                      <div
                        key={index}
                        className="my-8 relative rounded-lg overflow-hidden"
                      >
                        <img
                          src={section.url || "/placeholder.svg"}
                          alt={section.alt || ""}
                          width={800}
                          height={450}
                          className="w-full h-auto"
                        />
                        {section.caption && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {section.caption}
                          </p>
                        )}
                      </div>
                    );
                  } else if (section.type === "quote") {
                    return (
                      <blockquote
                        key={index}
                        className="border-l-4 border-primary pl-4 italic my-6"
                      >
                        {section.content}
                        {section.attribution && (
                          <footer className="text-sm text-muted-foreground mt-2">
                            — {section.attribution}
                          </footer>
                        )}
                      </blockquote>
                    );
                  } else if (section.type === "list") {
                    return (
                      <ul key={index} className="list-disc pl-6 my-4">
                        {section?.items?.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    );
                  }
                  return null;
                })}
              </div>

              <Separator className="my-8" />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <ArticleAuthor article={article} />
                <ShareButtons title={article.title} />
              </div>
            </article>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Related Articles</h2>
                <div className="space-y-4">
                  {relatedArticles.map((relatedArticle) => (
                    <Card key={relatedArticle.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          {relatedArticle.featuredImage && (
                            <div className="relative w-20 h-20 flex-shrink-0">
                              <img
                                src={
                                  relatedArticle.featuredImage ||
                                  "/placeholder.svg"
                                }
                                alt={relatedArticle.title}
                                className="object-cover rounded-md"
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium line-clamp-2 mb-1">
                              <Link
                                to={`/news/${relatedArticle.id}`}
                                className="hover:text-primary transition-colors"
                              >
                                {relatedArticle.title}
                              </Link>
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                relatedArticle.publishedAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  <Link to="/news?category=events">
                    <Badge variant="outline" className="hover:bg-muted">
                      Events
                    </Badge>
                  </Link>
                  <Link to="/news?category=announcements">
                    <Badge variant="outline" className="hover:bg-muted">
                      Announcements
                    </Badge>
                  </Link>
                  <Link to="/news?category=programs">
                    <Badge variant="outline" className="hover:bg-muted">
                      Programs
                    </Badge>
                  </Link>
                  <Link to="/news?category=resources">
                    <Badge variant="outline" className="hover:bg-muted">
                      Resources
                    </Badge>
                  </Link>
                  <Link to="/news?category=community">
                    <Badge variant="outline" className="hover:bg-muted">
                      Community
                    </Badge>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
