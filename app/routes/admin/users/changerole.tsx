import { useState } from "react"
import { useParams, useNavigate } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { useUsers } from "~/hooks/useUsers"

export default function ChangeRole() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { users, updateRole } = useUsers()
  const user = users.find((u) => u.id === parseInt(userId))
  const [selectedRole, setSelectedRole] = useState(user?.role.role_type || "")

  const roleOptions = [
    { id: 1, value: "admin", label: "Admin" },
    { id: 2, value: "librarian", label: "Librarian" },
    { id: 3, value: "user", label: "User" },
  ]

  const handleRoleChange = async () => {
    if (!selectedRole) return
    const roleId = roleOptions.find((role) => role.value === selectedRole)?.id
    if (roleId) {
      try {
        await updateRole(userId, roleId)
        navigate("/admin/users")
      } catch (error) {
        console.error("Failed to update role:", error)
      }
    }
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Role for {user.first_name} {user.last_name}</CardTitle>
          <CardDescription>Update the user's role in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Role
              </label>
              <Select
                value={selectedRole}
                onValueChange={setSelectedRole}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((role) => (
                    <SelectItem key={role.id} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleRoleChange} disabled={!selectedRole}>
                Update Role
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/admin/users")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}