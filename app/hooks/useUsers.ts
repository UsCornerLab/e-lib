import { useState, useCallback, useEffect } from "react";
import {
  listUsers,
  createUser,
  editUser,

  deleteUser,
  type User,
  type CreateUserPayload,
  type EditUserPayload,
} from "../services/userService";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");

  // Load token from localStorage on client side
  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setToken(t);
  }, []);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listUsers(token);
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addUser = useCallback(
    async (payload: CreateUserPayload) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const newUser = await createUser(payload, token);
        setUsers((prev) => [...prev, newUser]);
      } catch (err: any) {
        setError(err.message || "Failed to create user");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const updateUser = useCallback(
    async (id: number, payload: EditUserPayload) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const updatedUser = await editUser(id, payload, token);
        setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
      } catch (err: any) {
        setError(err.message || "Failed to update user");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

 const updateUserRole = useCallback(
  async (id: number, role: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await editUser(id, { role }, token);
      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
      console.log("User role updated successfully");
      console.log(`User ID: ${id}, New Role: ${role}`);
    } catch (err: any) {
      setError(err.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  },
  [token]
);


const updateUserStatus = useCallback(
  async (id: number, verified: boolean) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await editUser(id, { verified }, token);
      setUsers((prev) => prev.map((u) => (u.id === id ? updatedUser : u)));
      console.log(`User ${id} verified status updated to ${verified}`);
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  },
  [token]
);


  const removeUser = useCallback(
    async (id: number) => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        await deleteUser(id, token);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (err: any) {
        setError(err.message || "Failed to delete user");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Fetch users once token is loaded
  useEffect(() => {
    if (token) fetchUsers();
  }, [token, fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    updateUser,
    updateUserRole,
    updateUserStatus,
    removeUser,
  };
}
