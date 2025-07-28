"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Upload, Save, Trash2 } from "lucide-react"
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

export default function EditBook() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  // Mock book data - in real app, this would be fetched from API
  const [formData, setFormData] = useState({
    title: "The Midnight Library",
    author: "Matt Haig",
    isbn: "9780525559474",
    publicationYear: "2020",
    genre: "Fiction",
    publisher: "Viking",
    language: "English",
    pageCount: 304,
    status: "available",
    location: "Main Library - Fiction Section",
    notes: "Popular title, high demand",
    acquisitionDate: "2021-03-15",
    lastCheckedOut: "2023-06-01",
    totalCheckouts: 12,
    copiesAvailable: 3,
    totalCopies: 5,
  })

  const [availability, setAvailability] = useState({
    canBeBorrowed: true,
    canBeReserved: true,
    availableDigitally: false,
  })

  const [circulationHistory] = useState([
    { date: "2023-06-01", action: "Checked out", user: "John Smith" },
    { date: "2023-05-28", action: "Returned", user: "Jane Doe" },
    { date: "2023-05-25", action: "Reserved", user: "Alice Johnson" },
    { date: "2023-05-20", action: "Checked out", user: "Bob Wilson" },
  ])

  const genres = [
    { value: "fiction", label: "Fiction" },
    { value: "non-fiction", label: "Non-Fiction" },
    { value: "mystery", label: "Mystery" },
    { value: "sci-fi", label: "Science Fiction" },
    { value: "fantasy", label: "Fantasy" },
    { value: "biography", label: "Biography" },
    { value: "history", label: "History" },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvailabilityChange = (key: string, checked: boolean) => {
    setAvailability((prev) => ({ ...prev, [key]: checked }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setCoverImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Updated book data:", {
      ...formData,
      availability,
      coverImage: coverImage?.name,
    })

    setIsSubmitting(false)
    navigate("/admin/books")
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      navigate("/admin/books")
    }
  }

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
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
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
                            {genres.map((genre) => (
                              <SelectItem key={genre.value} value={genre.value}>
                                {genre.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        <Label htmlFor="language">Language</Label>
                        <Input
                          id="language"
                          value={formData.language}
                          onChange={(e) => handleInputChange("language", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pageCount">Page Count</Label>
                      <Input
                        id="pageCount"
                        type="number"
                        value={formData.pageCount}
                        onChange={(e) => handleInputChange("pageCount", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Library Information</CardTitle>
                    <CardDescription>Book status and library details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Acquisition Date</Label>
                        <Input value={formData.acquisitionDate} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Checked Out</Label>
                        <Input value={formData.lastCheckedOut} disabled />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Total Checkouts</Label>
                        <Input value={formData.totalCheckouts} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Copies Available</Label>
                        <Input value={formData.copiesAvailable} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Book Cover</CardTitle>
                    <CardDescription>Update book cover image</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Avatar className="h-24 w-24">
                          <AvatarImage
                            src={coverImage ? URL.createObjectURL(coverImage) : "/placeholder.svg"}
                            alt="Book Cover"
                          />
                          <AvatarFallback>{formData.title.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="text-center">
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
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Book Settings</CardTitle>
                    <CardDescription>Status and location configuration</CardDescription>
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

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="notes">Admin Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Book Availability</CardTitle>
              <CardDescription>Manage book borrowing and access settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(availability).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor={key} className="capitalize font-medium">
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {key === "canBeBorrowed" && "Allow physical borrowing of this book"}
                        {key === "canBeReserved" && "Allow users to place holds on this book"}
                        {key === "availableDigitally" && "Available as an e-book or digital resource"}
                      </p>
                    </div>
                    
                  </div>
                ))}
              </div>
              <Button onClick={() => console.log("Save availability:", availability)}>
                Save Availability
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Circulation History</CardTitle>
              <CardDescription>Recent borrowing and reservation activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {circulationHistory.map((history, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {history.action} by {history.user}
                      </p>
                      <p className="text-sm text-muted-foreground">{history.date}</p>
                    </div>
                    <Badge variant="outline">{history.action}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}