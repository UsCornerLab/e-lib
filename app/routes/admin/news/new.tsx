// app/routes/admin.news.new.tsx
import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, X, Plus, Minus } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Link } from "react-router";
import type { ArticleSection } from "~/lib/news-data";
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
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    author: "",
    authorTitle: "",
    publishedAt: new Date().toISOString().slice(0, 16),
    imageAlt: "",
    imageCaption: "",
  });

  const [content, setContent] = useState<ArticleSection[]>([
    { type: "paragraph", content: "" },
  ]);

  const categories = [
    "events",
    "announcements",
    "programs",
    "resources",
    "community",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "title" && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: slugify(value) }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addContentSection = (type: ArticleSection["type"]) => {
    const newSection: ArticleSection = { type, content: "" };
    if (type === "list") newSection.items = [""];
    setContent([...content, newSection]);
  };

  const updateContentSection = (
    index: number,
    updates: Partial<ArticleSection>
  ) => {
    const newContent = [...content];
    newContent[index] = { ...newContent[index], ...updates };
    setContent(newContent);
  };

  const removeContentSection = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const addListItem = (sectionIndex: number) => {
    const newContent = [...content];
    const section = newContent[sectionIndex];
    if (section.type === "list" && section.items) {
      section.items.push("");
    }
    setContent(newContent);
  };

  const updateListItem = (
    sectionIndex: number,
    itemIndex: number,
    value: string
  ) => {
    const newContent = [...content];
    const section = newContent[sectionIndex];
    if (section.type === "list" && section.items) {
      section.items[itemIndex] = value;
    }
    setContent(newContent);
  };

  const removeListItem = (sectionIndex: number, itemIndex: number) => {
    const newContent = [...content];
    const section = newContent[sectionIndex];
    if (section.type === "list" && section.items) {
      section.items = section.items.filter((_, i) => i !== itemIndex);
    }
    setContent(newContent);
  };

  const buildContentString = () => {
    // We'll stringify the structured content so backend can parse or store as JSON string
    return JSON.stringify(content);
  };

  const validateForPublish = (isPublish: boolean) => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return false;
    }
    if (!formData.slug.trim()) {
      alert("Slug is required");
      return false;
    }
    if (
      !content ||
      content.length === 0 ||
      !content.some(
        (s) =>
          (s.content && s.content.trim()) || (s.items && s.items.some(Boolean))
      )
    ) {
      alert("Article content required");
      return false;
    }
    if (isPublish && !formData.publishedAt) {
      alert("Published date/time is required when publishing");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent, publish = true) => {
    e.preventDefault();
    const isPublish = publish;
    if (!validateForPublish(isPublish)) return;

    setIsSubmitting(true);

    try {
      // Prepare FormData in the shape Laravel expects
      const fd = new FormData();
      fd.append("title", formData.title);
      fd.append("slug", formData.slug);
      fd.append("excerpt", formData.excerpt || "");
      fd.append("content", buildContentString());
      fd.append("is_published", isPublish ? "1" : "0");
      if (isPublish) {
        // Laravel requires published_at when is_published is true
        // Convert datetime-local (YYYY-MM-DDTHH:mm) to a full ISO-ish string acceptable by Laravel
        const publishedAt = formData.publishedAt || new Date().toISOString();
        fd.append("published_at", publishedAt);
      } else {
        // explicit null or omit; omit is okay
      }
      // optional fields
      if (formData.category) fd.append("category", formData.category);
      if (formData.author) fd.append("author", formData.author);
      if (formData.authorTitle) fd.append("authorTitle", formData.authorTitle);
      if (formData.imageAlt) fd.append("imageAlt", formData.imageAlt);
      if (formData.imageCaption)
        fd.append("imageCaption", formData.imageCaption);
      // tags - backend doesn't validate these, but we can add them as array
      tags.forEach((t) => fd.append("tags[]", t));

      if (featuredImage) fd.append("featured_image", featuredImage);

      // call the hook create method
      const created = await create(fd);
      console.log("Created news:", created);

      // navigate to listing
      navigate("/admin/news");
    } catch (err: any) {
      console.error("Failed to create news:", err);
      alert(err.message || "Failed to publish article");
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
            Write and publish a new news article
          </p>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
                <CardDescription>
                  Basic information about the article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter article title..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", slugify(e.target.value))
                      }
                      placeholder="auto-generated from title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) =>
                        handleInputChange("excerpt", e.target.value)
                      }
                      placeholder="Brief summary of the article..."
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="capitalize"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publishedAt">Publication Date</Label>
                    <Input
                      id="publishedAt"
                      type="datetime-local"
                      value={formData.publishedAt}
                      onChange={(e) =>
                        handleInputChange("publishedAt", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) =>
                        handleInputChange("author", e.target.value)
                      }
                      placeholder="Author name..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="authorTitle">Author Title</Label>
                    <Input
                      id="authorTitle"
                      value={formData.authorTitle}
                      onChange={(e) =>
                        handleInputChange("authorTitle", e.target.value)
                      }
                      placeholder="e.g., Head Librarian"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
                <CardDescription>
                  Build your article content with different section types
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <Select
                        value={section.type}
                        onValueChange={(value: ArticleSection["type"]) =>
                          updateContentSection(index, {
                            type: value,
                            content: "",
                            items: value === "list" ? [""] : undefined,
                          })
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paragraph">Paragraph</SelectItem>
                          <SelectItem value="heading">Heading</SelectItem>
                          <SelectItem value="quote">Quote</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContentSection(index)}
                        disabled={content.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {section.type === "paragraph" && (
                      <Textarea
                        value={section.content || ""}
                        onChange={(e) =>
                          updateContentSection(index, {
                            content: e.target.value,
                          })
                        }
                        placeholder="Enter paragraph content..."
                        rows={4}
                      />
                    )}

                    {section.type === "heading" && (
                      <Input
                        value={section.content || ""}
                        onChange={(e) =>
                          updateContentSection(index, {
                            content: e.target.value,
                          })
                        }
                        placeholder="Enter heading text..."
                      />
                    )}

                    {section.type === "quote" && (
                      <div className="space-y-2">
                        <Textarea
                          value={section.content || ""}
                          onChange={(e) =>
                            updateContentSection(index, {
                              content: e.target.value,
                            })
                          }
                          placeholder="Enter quote text..."
                          rows={3}
                        />
                        <Input
                          value={section.attribution || ""}
                          onChange={(e) =>
                            updateContentSection(index, {
                              attribution: e.target.value,
                            })
                          }
                          placeholder="Attribution (optional)..."
                        />
                      </div>
                    )}

                    {section.type === "list" && (
                      <div className="space-y-2">
                        {section.items?.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-2">
                            <Input
                              value={item}
                              onChange={(e) =>
                                updateListItem(index, itemIndex, e.target.value)
                              }
                              placeholder={`List item ${itemIndex + 1}...`}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeListItem(index, itemIndex)}
                              disabled={(section.items?.length || 0) === 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addListItem(index)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentSection("paragraph")}
                  >
                    Add Paragraph
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentSection("heading")}
                  >
                    Add Heading
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentSection("quote")}
                  >
                    Add Quote
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addContentSection("list")}
                  >
                    Add List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>
                  Upload a featured image for the article
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {featuredImage ? (
                    <div className="relative">
                      <img
                        src={
                          URL.createObjectURL(featuredImage) ||
                          "/placeholder.svg"
                        }
                        alt="Featured image preview"
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
                          <span className="text-sm text-muted-foreground">
                            {" "}
                            or drag and drop
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

                  {featuredImage && (
                    <div className="space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="imageAlt">Alt Text</Label>
                        <Input
                          id="imageAlt"
                          value={formData.imageAlt}
                          onChange={(e) =>
                            handleInputChange("imageAlt", e.target.value)
                          }
                          placeholder="Describe the image for accessibility..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="imageCaption">Caption (optional)</Label>
                        <Input
                          id="imageCaption"
                          value={formData.imageCaption}
                          onChange={(e) =>
                            handleInputChange("imageCaption", e.target.value)
                          }
                          placeholder="Image caption..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => handleSubmit(e as any, true)}
                >
                  {isSubmitting ? "Publishing..." : "Publish Article"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={(e) => handleSubmit(e as any, false)}
                >
                  Save as Draft
                </Button>
              </div>
              <Link to="/admin/news">Cancel</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
