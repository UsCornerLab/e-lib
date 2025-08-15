export interface User {
  id: number
  username: string
  email: string
  active: boolean
  
}

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch("http://127.0.0.1:8000/api/users", {
    headers: {
      "Content-Type": "application/json",
      
    },
  })
  if (!res.ok) throw new Error("Failed to fetch users")
  return res.json()
}

export async function editUser(userId: number, updatedData: Partial<User>): Promise<User> {
  const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
  if (!res.ok) throw new Error("Failed to edit user")
  return res.json()
}

export async function deleteUser(userId: number): Promise<void> {
  const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
  if (!res.ok) throw new Error("Failed to delete user")
}

export async function deactivateUser(userId: number): Promise<User> {
  
  const res = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
    method: "PATCH", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ active: false }),
  })
  if (!res.ok) throw new Error("Failed to deactivate user")
  return res.json()
}
