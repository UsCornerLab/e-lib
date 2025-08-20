"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Upload, Save, Trash2 } from "lucide-react"
import { useBooks } from "~/hooks/useBooks"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Separator } from "~/components/ui/separator"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Link } from "react-router"

export default function EditBookPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { book, loading, error, fetchBook, updateBook } = useBooks()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publicationYear: "",
    genre: "",
    publisher: "",
    status: "available",
  })

  const genres = [
    { value: "fiction", label: "Fiction" },
    { value: "non-fiction", label: "Non-Fiction" },
    { value: "mystery", label: "Mystery" },
    { value: "sci-fi", label: "Science Fiction" },
    { value: "fantasy", label: "Fantasy" },
    { value: "biography", label: "Biography" },
    { value: "history", label: "History" },
  ]

  // Fetch book details
  useEffect(() => {
    if (id) fetchBook(Number(id))
  }, [id, fetchBook])

  // Sync fetched book into form
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author?.map(a => a.author_name).join(", ") || "",
        isbn: book.ISBN || "",
        publicationYear: book.publication_date || "",
        genre: book.genre?.map(g => g.genre_name).join(", ") || "",
        publisher: book.publisher || "",
        status: book.status || "available",
      })
      setCoverImage(null)
    }
  }, [book])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setCoverImage(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setIsSubmitting(true)

    try {
      let payload: any
      if (coverImage) {
        payload = new FormData()
        Object.entries({
          ...formData,
          genre: formData.genre.split(",").map((s) => s.trim()),
          author: formData.author.split(",").map((s) => s.trim()),
        }).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v) => payload.append(`${key}[]`, v))
          } else {
            payload.append(key, value as any)
          }
        })
        payload.append("cover_image", coverImage)
      } else {
        payload = {
          ...formData,
          genre: formData.genre.split(",").map((s) => s.trim()),
          author: formData.author.split(",").map((s) => s.trim()),
        }
      }

      await updateBook(Number(id), payload)
      navigate("/admin/books")
    } catch (err) {
      console.error("Failed to update book:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this book?")) return
    await updateBook(Number(id), { deleted: true }) // or delete API call
    navigate("/admin/books")
  }

  if (loading) return <p>Loading book...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Book</h1>
            <p className="text-muted-foreground">
              {formData.title} • {formData.isbn}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Book
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Book Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Book Information</CardTitle>
                    <CardDescription>Update book details and metadata</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) => handleInputChange("author", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="isbn">ISBN</Label>
                        <Input
                          id="isbn"
                          value={formData.isbn}
                          onChange={(e) => handleInputChange("isbn", e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="publicationYear">Publication Year</Label>
                        <Input
                          id="publicationYear"
                          value={formData.publicationYear}
                          onChange={(e) => handleInputChange("publicationYear", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="genre">Genre</Label>
                        <Select
                          value={formData.genre}
                          onValueChange={(value) => handleInputChange("genre", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {genres.map((g) => (
                              <SelectItem key={g.value} value={g.value}>
                                {g.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar: Cover + Settings */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Book Cover</CardTitle>
                    <CardDescription>Update book cover image</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={coverImage ? URL.createObjectURL(coverImage) : book?.cover_image_path || "/placeholder.svg"}
                          alt="Book Cover"
                        />
                        <AvatarFallback>{formData.title.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-center mt-2">
                      <Label htmlFor="cover-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload New Cover
                          </span>
                        </Button>
                      </Label>
                      <Input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Book Settings</CardTitle>
                    <CardDescription>Status configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Book Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleInputChange("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="checked-out">Checked Out</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
