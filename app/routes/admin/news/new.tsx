// app/routes/admin.news.new.tsx
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
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
import { Link } from "react-router";
import { useNews } from "~/hooks/useNews";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\s\_]+/g, "-")
    .replace(/[^a-z0-9\-]+/g, "")
    .replace(/\-+/g, "-")
    .replace(/^\-+|\-+$/g, "");
}

export default function NewArticle() {
  const navigate = useNavigate();
  const { create } = useNews();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    publishedAt: new Date().toISOString().slice(0, 16), // yyyy-mm-ddTHH:MM
  });

  const [isPublished, setIsPublished] = useState<boolean>(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (field === "title" && !form.slug) {
      setForm((p) => ({ ...p, slug: slugify(value) }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFeaturedImage(f);
  };

  const validate = (publishing: boolean) => {
    if (!form.title.trim()) {
      alert("Title is required.");
      return false;
    }
    if (!form.slug.trim()) {
      alert("Slug is required.");
      return false;
    }
    if (!form.content.trim()) {
      alert("Content is required.");
      return false;
    }
    if (publishing && !form.publishedAt) {
      alert("Published date/time is required when publishing.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent, publishing = true) => {
    e.preventDefault();
    if (!validate(publishing)) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("slug", slugify(form.slug));
      fd.append("excerpt", form.excerpt || "");
      fd.append("content", form.content);
      fd.append("is_published", publishing ? "1" : "0");
      if (publishing) {
        // send published_at when publishing
        // convert datetime-local string to ISO-like string acceptable by Laravel
        const publishedAt = form.publishedAt || new Date().toISOString();
        fd.append("published_at", publishedAt);
      }
      if (featuredImage) fd.append("featured_image", featuredImage);

      await create(fd);
      navigate("/admin/news");
    } catch (err: any) {
      console.error("Create news error:", err);
      alert(err?.message || "Failed to create article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/news">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to News
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create New Article</h1>
          <p className="text-muted-foreground">
            Minimal fields — backend-compatible
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: basic fields */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article</CardTitle>
                <CardDescription>
                  Only the fields the backend validates
                </CardDescription>
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
                      onChange={(e) =>
                        handleChange("slug", slugify(e.target.value))
                      }
                      placeholder="auto-generated from title"
                      required
                    />
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

          {/* Right: image + publish controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>
                  Optional image (jpg/png, ≤10MB)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredImage ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(featuredImage)}
                        alt="featured preview"
                        className="w-full aspect-video object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setFeaturedImage(null)}
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
                          onChange={handleImageUpload}
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
                <CardTitle>Publish</CardTitle>
                <CardDescription>Choose publish state</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Publish now</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={isPublished ? "default" : "outline"}
                      onClick={() => setIsPublished(true)}
                    >
                      Publish
                    </Button>
                    <Button
                      type="button"
                      variant={!isPublished ? "outline" : "default"}
                      onClick={() => setIsPublished(false)}
                    >
                      Save Draft
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    onClick={(e) => handleSubmit(e as any, isPublished)}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? isPublished
                        ? "Publishing..."
                        : "Saving..."
                      : isPublished
                      ? "Publish Article"
                      : "Save Draft"}
                  </Button>
                  <Link
                    to="/admin/news"
                    className="text-sm text-muted-foreground"
                  >
                    Cancel
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
