// services/userService.ts
// export interface Role {
//   id: number;
//   role_type: string;
// }

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthDate: string;
  role: string;
  address: string;
  id_photo_path: string;
  profile: string;
  verified: boolean;
  created_at: string;
  updated_at: string;

}

export interface UsersResponse {
  status: boolean;
  users: User[];
}

const API_BASE = "http://127.0.0.1:8000/api/users";
const API_BASE2 =  "http://127.0.0.1:8000/api/updateProfile";
const API_BASE3 = "http://127.0.0.1:8000/api/register";

// Helper to build headers with JWT
const buildHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function createUserMultipart(
  form: FormData,
  token: string
): Promise<User> {
  const res = await fetch(API_BASE3, {
    method: "POST",
    headers: {
      // only send Authorization header; let browser set Content-Type with boundary
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  const data = await res.json();
  if (!data.status) {
    // backend returns message field on errors
    throw new Error(data.message || "Failed to create user");
  }
  return data.user;
}

export async function listUsers(token: string): Promise<User[]> {
  const res = await fetch(API_BASE, {
    headers: buildHeaders(token),
  });
  const data: UsersResponse = await res.json();
  if (!data.status) throw new Error("Failed to fetch users");
  return data.users;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  birthDate: string;
  address: string;
  role: number;
  password: string;
}

export async function createUser(payload: CreateUserPayload, token: string): Promise<User> {
  const res = await fetch(API_BASE3, {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.status) throw new Error("Failed to create user");
  return data.user;
}

export interface EditUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  birthDate?: string;
  address?: string;
  role?: string;
  verified?: boolean;
  profile?: File;       
  id_photo_path?: File
}

export async function editUser(id: number, payload: EditUserPayload, token: string): Promise<User> {
  const res = await fetch(`${API_BASE2}/${id}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.status) throw new Error("Failed to update user");
  return data.user;
}

export function updateUserRole(
  id: number,
  role: string,
  token: string
): Promise<User> {
  console.log(`Updating role for user ${id} to ${role}`);
  return editUser(id, { role }, token);
}

// Update active/deactivated status only
export function updateUserStatus(
  id: number,
  verified: boolean,
  token: string
): Promise<User> {
  return editUser(id, { verified }, token);
}



export async function deleteUser(id: number, token: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });
  const data = await res.json();
  if (!data.status) throw new Error("Failed to delete user");
  return true;
}
