// app/routes/admin/news/$id/edit.tsx
import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useNews } from "~/hooks/useNews";

function toDateTimeLocal(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 16);
  const d = new Date(value);
  const iso = d.toISOString();
  return iso.slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

export default function EditNewsPage() {
  const { id } = useParams();
  const newsId = Number(id);
  const navigate = useNavigate();
  const { fetchOne, update, remove } = useNews();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    publishedAt: toDateTimeLocal(),
    isPublished: false,
  });

  useEffect(() => {
    if (!newsId) return;
    (async () => {
      setLoading(true);
      try {
        const item = await fetchOne(newsId);
        setForm({
          title: item.title ?? "",
          slug: item.slug ?? "",
          excerpt: item.excerpt ?? "",
          content: item.content ?? "",
          publishedAt: toDateTimeLocal(item.published_at ?? undefined),
          isPublished: !!item.is_published,
        });
        setExistingImageUrl(item.featured_image ?? null);
      } catch (err: any) {
        console.error("Failed to load news:", err);
        alert(err?.message || "Failed to load news item");
      } finally {
        setLoading(false);
      }
    })();
  }, [newsId, fetchOne]);

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((p) => ({ ...p, [field]: value as any }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFeaturedImageFile(f);
    if (f) {
      setExistingImageUrl(URL.createObjectURL(f)); // preview chosen file
    }
  };

  const validate = () => {
    if (!form.title.trim()) {
      alert("Title is required");
      return false;
    }
    if (!form.slug.trim()) {
      alert("Slug is required");
      return false;
    }
    if (!form.content.trim()) {
      alert("Content is required");
      return false;
    }
    if (form.isPublished && !form.publishedAt) {
      alert("Published date is required when publishing");
      return false;
    }
    return true;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("slug", form.slug);
      fd.append("excerpt", form.excerpt || "");
      fd.append("content", form.content);
      fd.append("is_published", form.isPublished ? "1" : "0");
      if (form.isPublished) fd.append("published_at", form.publishedAt);
      if (featuredImageFile) fd.append("featured_image", featuredImageFile);
      // update via hook (which will add _method=PUT as needed)
      await update(newsId, fd);
      navigate("/admin/news");
    } catch (err: any) {
      console.error("Update failed:", err);
      alert(err?.message || "Failed to update news");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this news post? This is permanent.")) return;
    try {
      await remove(newsId);
      navigate("/admin/news");
    } catch (err: any) {
      console.error("Delete failed:", err);
      alert(err?.message || "Failed to delete news");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/news">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to News
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Article</h1>
          <p className="text-muted-foreground">
            Modify and update the news post
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article</CardTitle>
                <CardDescription>Only backend-validated fields</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => handleChange("slug", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Published:</span>
                    <Button
                      type="button"
                      variant={form.isPublished ? "default" : "outline"}
                      onClick={() =>
                        handleChange("isPublished", !form.isPublished)
                      }
                    >
                      {form.isPublished ? "Yes" : "No"}
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="publishedAt">Publication Date</Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      value={form.publishedAt}
                      onChange={(e) =>
                        handleChange("publishedAt", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={form.excerpt}
                    onChange={(e) => handleChange("excerpt", e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={form.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    rows={10}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>
                  Replace or remove featured image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {existingImageUrl ? (
                    <div className="relative">
                      <img
                        src={existingImageUrl}
                        alt="featured preview"
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setExistingImageUrl(null);
                          setFeaturedImageFile(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <div className="mt-4">
                        <Label
                          htmlFor="featured-upload"
                          className="cursor-pointer"
                        >
                          <span className="text-sm font-medium text-primary hover:text-primary/80">
                            Click to upload
                          </span>
                        </Label>
                        <Input
                          id="featured-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFile}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Publish or delete</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/news")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
