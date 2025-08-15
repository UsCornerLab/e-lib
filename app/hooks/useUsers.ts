import { useState, useCallback } from "react"
import * as userService from "~/services/userService"

export function useUsers() {
  const [users, setUsers] = useState<userService.User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.fetchUsers()
      setUsers(data)
    } catch (err: any) {
      setError(err.message || "Error fetching users")
    } finally {
      setLoading(false)
    }
  }, [])

  const editUser = useCallback(async (userId: number, updatedData: Partial<userService.User>) => {
    setLoading(true)
    setError(null)
    try {
      const updatedUser = await userService.editUser(userId, updatedData)
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user))
      )
    } catch (err: any) {
      setError(err.message || "Error editing user")
    } finally {
      setLoading(false)
    }
  }, [])

  const removeUser = useCallback(async (userId: number) => {
    setLoading(true)
    setError(null)
    try {
      await userService.deleteUser(userId)
      setUsers((prev) => prev.filter((user) => user.id !== userId))
    } catch (err: any) {
      setError(err.message || "Error deleting user")
    } finally {
      setLoading(false)
    }
  }, [])

  const deactivateUser = useCallback(async (userId: number) => {
    setLoading(true)
    setError(null)
    try {
      const updatedUser = await userService.deactivateUser(userId)
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updatedUser : user))
      )
    } catch (err: any) {
      setError(err.message || "Error deactivating user")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers,
    editUser,
    removeUser,
    deactivateUser,
  }
}
