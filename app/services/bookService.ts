export interface BookPayload {
  id?: number;
  title: string;
  ISBN: string;
  publisher: string;
  publication_date: string;
  authors: { author_name: string }[];  
  genres: { genre_name: string }[];    
  cover_image?: File | null;
  accession_number?: string;
  category?: { id: number; category_name: string };  
  from_org_name?: string;
  from_type?: string;
  shelf_name?: string;
  shelf_number?: number;
  added_by?: { id: number; first_name: string; last_name: string; email: string }; 
  status?: string;
  available_copies?: number;
  copies?: number;
}


const API_BASE_URL = "http://localhost:8000/api/books";

// Convert payload to FormData
function toFormData(payload: BookPayload): FormData {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => formData.append(`${key}[]`, v));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });
  return formData;
}

// Always attach token if available
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// CREATE
export async function createBook(payload: BookPayload) {
  const formData = toFormData(payload);

  const res = await fetch(`${API_BASE_URL}/countBook/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) throw new Error(`Failed to create book: ${res.statusText}`);
  return await res.json().catch(() => null);
}

// READ ALL (Always return an array)
export async function getBooks(): Promise<BookPayload[]> {
  const res = await fetch(`${API_BASE_URL}/`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error(`Failed to fetch books: ${res.statusText}`);

  const json = await res.json();
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.books)) return json.books;
  return [];
}

// READ ONE
export async function getBook(id: number): Promise<BookPayload> {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error(`Failed to fetch book ${id}: ${res.statusText}`);
  return await res.json();
}

// UPDATE
export async function updateBook(id: number, payload: BookPayload) {
  const formData = toFormData(payload);

  const res = await fetch(`${API_BASE_URL}/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) throw new Error(`Failed to update book ${id}: ${res.statusText}`);
  return await res.json();
}

// DELETE
export async function deleteBook(id: number) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error(`Failed to delete book ${id}: ${res.statusText}`);
}
