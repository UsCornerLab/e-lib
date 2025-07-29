
import { useState } from "react"
import { Link } from "react-router"
import { Search, Filter, MoreHorizontal, Edit, Trash2, Shield, UserCheck, UserX } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    role: "member",
    status: "active",
    joinDate: "2023-01-15",
    lastActive: "2023-06-01",
    booksCheckedOut: 3,
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    role: "librarian",
    status: "active",
    joinDate: "2022-03-10",
    lastActive: "2023-06-02",
    booksCheckedOut: 0,
    avatar: "/images/sarah-williams.jpg",
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    role: "editor",
    status: "active",
    joinDate: "2022-08-22",
    lastActive: "2023-06-01",
    booksCheckedOut: 1,
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    role: "member",
    status: "inactive",
    joinDate: "2023-02-28",
    lastActive: "2023-04-15",
    booksCheckedOut: 0,
    avatar: "/images/emily-johnson.jpg",
  },
  {
    id: "5",
    name: "Robert Wilson",
    email: "robert.wilson@email.com",
    role: "administrator",
    status: "active",
    joinDate: "2021-11-05",
    lastActive: "2023-06-02",
    booksCheckedOut: 2,
    avatar: "/placeholder.svg",
  },
]

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState(mockUsers)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleStatusToggle = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  const handleDelete = (userId: string) => {
    // In a real app, this would make an API call
    console.log("Delete user:", userId)
    setUsers(users.filter((user) => user.id !== userId))
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "administrator":
        return "destructive"
      case "librarian":
        return "default"
      case "editor":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage library user accounts and permissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>{filteredUsers.length} registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Books Out</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.joinDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {new Date(user.lastActive).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>{user.booksCheckedOut}</TableCell>
                    <TableCell className="text-right">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem asChild>
        <Link to={`/admin/users/${user.id}/edit`}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to={`/admin/users/${user.id}/role`}>
          <Shield className="mr-2 h-4 w-4" />
          Change Role
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => handleStatusToggle(user.id)}>
        {user.status === "active" ? (
          <>
            <UserX className="mr-2 h-4 w-4" />
            Deactivate
          </>
        ) : (
          <>
            <UserCheck className="mr-2 h-4 w-4" />
            Activate
          </>
        )}
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(user.id)}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Account
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
