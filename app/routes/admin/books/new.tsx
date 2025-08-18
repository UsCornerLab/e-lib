import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Checkbox } from "~/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"
import { Link } from "react-router"
import { useBooks } from "~/hooks/useBooks"

export default function NewBook() {
  const navigate = useNavigate()
  const { createBook } = useBooks()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [genres, setGenres] = useState<string[]>([])
  const [author, setAuthors] = useState<string[]>([])
  const [newAuthorInput, setNewAuthorInput] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    publisher: "",
    publication_date: new Date().toISOString().split('T')[0],
    accession_number: "",
    category: "",
    from_org_name: "",
    from_type: "Donated",
    shelf_name: "",
    shelf_number: "",
    added_by: "",
    copies: 1
  })

  const availableGenres = ["fantasy","social","science","history","biography"]
  const availableFromTypes = ["Donated", "Purchased", "Gifted"]

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenreToggle = (genre: string) => {
    setGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  const handleAddAuthors = () => {
    if (!newAuthorInput.trim()) return
    const authorsToAdd = newAuthorInput
      .split(',')
      .map(a => a.trim())
      .filter(a => a && !author.includes(a))
    if (authorsToAdd.length > 0) {
      setAuthors([...author, ...authorsToAdd])
      setNewAuthorInput("")
    }
  }

  const handleRemoveAuthor = (authorToRemove: string) => {
    setAuthors(author.filter(a => a !== authorToRemove))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setCoverImage(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (genres.length === 0) {
      alert("Please select at least one genre")
      return
    }

    setIsSubmitting(true)

    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => form.append(key, value.toString()))
      author.forEach(a => form.append("author[]", a))
      genres.forEach(g => form.append("genre[]", g))
      //////////////////
 // Assuming current user ID is 1)
      /////////////////
      if (coverImage) form.append("cover_image", coverImage)

      await createBook(form)
      navigate("/admin/books")
    } catch (err: any) {
      console.error("Error creating book:", err)
      alert(err.message || "Failed to create book")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Book</h1>
          <p className="text-muted-foreground">Add a new book to the library collection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the basic details of the book</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={formData.isbn}
                      onChange={(e) => handleInputChange("isbn", e.target.value)}
                      placeholder="9788417563114"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publication_date">Publication Date</Label>
                    <Input
                      id="publication_date"
                      type="date"
                      value={formData.publication_date}
                      onChange={(e) => handleInputChange("publication_date", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publisher">Publisher</Label>
                    <Input
                      id="publisher"
                      value={formData.publisher}
                      onChange={(e) => handleInputChange("publisher", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accession_number">Accession Number</Label>
                    <Input
                      id="accession_number"
                      value={formData.accession_number}
                      onChange={(e) => handleInputChange("accession_number", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="copies">Copies</Label>
                    <Input
                      id="copies"
                      type="number"
                      value={formData.copies}
                      onChange={(e) => handleInputChange("copies", Number(e.target.value))}
                      min="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authors */}
            <Card>
              <CardHeader>
                <CardTitle>Authors</CardTitle>
                <CardDescription>Add authors for this book</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newAuthorInput}
                    onChange={(e) => setNewAuthorInput(e.target.value)}
                    placeholder="Enter author names, separated by commas"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddAuthors()}
                  />
                  <Button type="button" onClick={handleAddAuthors}>Add</Button>
                </div>
                {author.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {author.map((a) => (
                      <Badge key={a} variant="secondary" className="flex items-center gap-1">
                        {a}
                        <button
                          type="button"
                          onClick={() => handleRemoveAuthor(a)}
                          className="rounded-full hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Genres */}
            <Card>
              <CardHeader>
                <CardTitle>Genres</CardTitle>
                <CardDescription>Select the genres for this book</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((g) => (
                    <div key={g} className="flex items-center space-x-2">
                      <Checkbox
                        id={g}
                        checked={genres.includes(g)}
                        onCheckedChange={() => handleGenreToggle(g)}
                      />
                      <Label htmlFor={g} className="capitalize">{g}</Label>
                    </div>
                  ))}
                </div>
                {genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {genres.map((g) => (
                      <Badge key={g} variant="secondary">
                        {g}
                        <button
                          type="button"
                          onClick={() => handleGenreToggle(g)}
                          className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acquisition */}
            <Card>
              <CardHeader>
                <CardTitle>Acquisition Details</CardTitle>
                <CardDescription>How this book was obtained</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from_org_name">Source Organization</Label>
                    <Input
                      id="from_org_name"
                      value={formData.from_org_name}
                      onChange={(e) => handleInputChange("from_org_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from_type">Acquisition Type</Label>
                    <Select value={formData.from_type} onValueChange={(v) => handleInputChange("from_type", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {availableFromTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shelf */}
            <Card>
              <CardHeader>
                <CardTitle>Shelf Information</CardTitle>
                <CardDescription>Where this book is located</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shelf_name">Shelf Name</Label>
                    <Input
                      id="shelf_name"
                      value={formData.shelf_name}
                      onChange={(e) => handleInputChange("shelf_name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shelf_number">Shelf Number</Label>
                    <Input
                      id="shelf_number"
                      value={formData.shelf_number}
                      onChange={(e) => handleInputChange("shelf_number", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">

            {/* Cover Image */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Image</CardTitle>
                <CardDescription>Upload a cover image for the book</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coverImage ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(coverImage)}
                        alt="Book cover preview"
                        className="w-full aspect-[2/3] object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => setCoverImage(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <div className="mt-4">
                        <Label htmlFor="cover-upload" className="cursor-pointer">
                          <span className="text-sm font-medium text-primary hover:text-primary/80">Click to upload</span>
                          <span className="text-sm text-muted-foreground"> or drag and drop</span>
                        </Label>
                        <Input
                          id="cover-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding Book..." : "Add Book"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/books">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
