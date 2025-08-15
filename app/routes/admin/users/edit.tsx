
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { ArrowLeft, Upload, Save, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Checkbox } from "~/components/ui/checkbox"
import { Separator } from "~/components/ui/separator"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Link } from "react-router"



export default function EditUser() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null)

  // Mock user data - in real app, this would be fetched from API
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    address: "123 Main Street",
    city: "Bookville",
    state: "BK",
    zipCode: "12345",
    dateOfBirth: "1985-06-15",
    role: "member",
    status: "active",
    libraryCardNumber: "LC1234567890",
    notes: "Regular patron, prefers mystery novels",
    joinDate: "2023-01-15",
    lastActive: "2023-06-01",
    booksCheckedOut: 3,
    totalBooksRead: 47,
  })

  const [permissions, setPermissions] = useState({
    canBorrowBooks: true,
    canReserveBooks: true,
    canAccessDigitalResources: true,
    canAttendEvents: true,
    canReceiveNotifications: true,
  })

  const [activityLog] = useState([
    { date: "2023-06-01", action: "Checked out", item: "The Midnight Library" },
    { date: "2023-05-28", action: "Returned", item: "Atomic Habits" },
    { date: "2023-05-25", action: "Reserved", item: "Project Hail Mary" },
    { date: "2023-05-20", action: "Attended event", item: "Author Talk Series" },
  ])

  const roles = [
    { value: "member", label: "Member", description: "Regular library patron" },
    { value: "librarian", label: "Librarian", description: "Library staff member" },
    { value: "editor", label: "Editor", description: "Can manage content" },
    { value: "administrator", label: "Administrator", description: "Full system access" },
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setPermissions((prev) => ({ ...prev, [permission]: checked }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfileImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("Updated user data:", {
      ...formData,
      permissions,
      profileImage: profileImage?.name,
    })

    setIsSubmitting(false)
    navigate("/admin/users")
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this user account? This action cannot be undone.")) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      navigate("/admin/users")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit User</h1>
            <p className="text-muted-foreground">
              {formData.firstName} {formData.lastName} • {formData.libraryCardNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update user details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Membership details and statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Join Date</Label>
                        <Input value={formData.joinDate} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Active</Label>
                        <Input value={formData.lastActive} disabled />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Books Currently Checked Out</Label>
                        <Input value={formData.booksCheckedOut} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Books Read</Label>
                        <Input value={formData.totalBooksRead} disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Image</CardTitle>
                    <CardDescription>Update user profile picture</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Avatar className="h-24 w-24">
                          <AvatarImage
                            src={profileImage ? URL.createObjectURL(profileImage) : "/placeholder.svg"}
                            alt="Profile"
                          />
                          <AvatarFallback>
                            {formData.firstName.charAt(0)}
                            {formData.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="text-center">
                        <Label htmlFor="profile-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" asChild>
                            <span>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload New Image
                            </span>
                          </Button>
                        </Label>
                        <Input
                          id="profile-upload"
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
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Role and status configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">User Role</Label>
                      <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              <div>
                                <div className="font-medium">{role.label}</div>
                                <div className="text-xs text-muted-foreground">{role.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Account Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending Verification</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="libraryCardNumber">Library Card Number</Label>
                      <Input
                        id="libraryCardNumber"
                        value={formData.libraryCardNumber}
                        onChange={(e) => handleInputChange("libraryCardNumber", e.target.value)}
                      />
                    </div>

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

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>User Permissions</CardTitle>
              <CardDescription>Manage what this user can access and do</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor={key} className="capitalize font-medium">
                        {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {key === "canBorrowBooks" && "Allow user to check out physical books"}
                        {key === "canReserveBooks" && "Allow user to place holds on books"}
                        {key === "canAccessDigitalResources" && "Access to e-books and digital content"}
                        {key === "canAttendEvents" && "Register for library events and programs"}
                        {key === "canReceiveNotifications" && "Receive email notifications and updates"}
                      </p>
                    </div>
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => handlePermissionChange(key, checked === true)}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={() => console.log("Save permissions:", permissions)}>Save Permissions</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>User's recent library activities and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {activity.action} "{activity.item}"
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                    <Badge variant="outline">{activity.action}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="books">
          <Card>
            <CardHeader>
              <CardTitle>Current Books</CardTitle>
              <CardDescription>Books currently checked out by this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">The Midnight Library</p>
                    <p className="text-sm text-muted-foreground">Due: June 15, 2023</p>
                  </div>
                  <Badge variant="outline">Checked Out</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Project Hail Mary</p>
                    <p className="text-sm text-muted-foreground">Due: June 20, 2023</p>
                  </div>
                  <Badge variant="outline">Checked Out</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Atomic Habits</p>
                    <p className="text-sm text-muted-foreground">Reserved</p>
                  </div>
                  <Badge variant="secondary">On Hold</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
