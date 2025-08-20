import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Plus,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useUsers } from "~/hooks/useUsers";

const availableRoles = [
  { id: 1, role_type: "admin" },
  { id: 2, role_type: "librarian" },
  { id: 3, role_type: "user" },
];

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, loading, error, removeUser, updateUserRole, updateUserStatus } = useUsers();

  const getRoleType = (role: string | { id: number; role_type: string }) => {
    if (typeof role === "string") return role;
    if (role && typeof role === "object") return role.role_type;
    return "unknown";
  };

  const filteredUsers = users.filter((user) =>
    [user.first_name, user.last_name, user.email, getRoleType(user.role)]
      .some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleChangeRole = (userId: number, role: string) => {
    updateUserRole(userId, role);
    console.log(`Changed role for user ${userId} to ${role}`);
  };

  const handleStatusToggle = (userId: number, verified: boolean) => {
    updateUserStatus(userId, !verified);
  };

  const handleDelete = (userId: number) => {
    removeUser(userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage library user accounts and permissions
          </p>
          {error && <p className="text-destructive mt-1">{error}</p>}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            {filteredUsers.length} registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            {/* Left: Search & Filter */}
            <div className="flex items-center space-x-2 flex-1">
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

            {/* Right: Add User Button */}
            <Link to="/admin/users/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </Link>
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.profile || "/placeholder.svg"}
                              alt={user.first_name}
                            />
                            <AvatarFallback>
                              {user.first_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getRoleBadgeVariant(getRoleType(user.role))}
                          className="capitalize"
                        >
                          {getRoleType(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.verified ? "default" : "secondary"}
                        >
                          {user.verified ? "active" : "inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {new Date(user.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
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

                            {/* Change Role */}
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Shield className="mr-2 h-4 w-4" />
                                Change Role
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                {availableRoles.map((role) => (
                                  <DropdownMenuItem
                                    key={role.id}
                                    onClick={() =>
                                      handleChangeRole(user.id, role.role_type)
                                    }
                                  >
                                    {role.role_type}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            {/* Activate / Deactivate */}
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusToggle(user.id, user.verified)
                              }
                            >
                              {user.verified ? (
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

                            {/* Delete */}
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(user.id)}
                            >
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper for role badge styling
function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "admin":
      return "destructive";
    case "librarian":
      return "default";
    case "user":
    default:
      return "outline";
  }
}
