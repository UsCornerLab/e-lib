import axios from "axios"

// ====================
// Interfaces
// ====================
export interface Book {
  id: number
  title: string
  ISBN: string
  publisher: string
  publication_date: string
  cover_image_path: string | null
  accession_number: number
  copies: number
  available_copies: number
  category_id: number
  added_by: {
    id: number
    first_name: string
    last_name: string
    email: string
    birthDate: string
    role_id: number
    address: string
    id_photo_path: string
    profile: string
    verified: boolean
    created_at: string
    updated_at: string
  }
  status: string
  from: number
  active: number
  created_at: string
  updated_at: string
  author: { author_name: string; pivot: { book_id: number; author_id: number } }[]
  genre: { genre_name: string; pivot: { book_id: number; genre_id: number } }[]
  category: { id: number; category_name: string }
  shelf: { id: number; book_id: number; shelf_name: string; shelf_number: number }
  origin: { id: number; org_name: string; type: string }
}

export interface PaginatedBooks {
  data: Book[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number
  to?: number
}

export interface BookResponse {
  status: boolean
  message: string
  books?: PaginatedBooks
  book?: Book
}

// ====================
// Payload for create/update
// ====================
export type BookPayload = Omit<
  Book,
  "id" | "created_at" | "updated_at" | "added_by" | "status" | "from" | "active"
>

// ====================
// API Setup
// ====================
const API_URL = "http://127.0.0.1:8000/api"

// ====================
// Services
// ====================
export const bookServices = {
  // Get all books
  getBooks: async (
    token: string,
    page: number = 1,
    perPage: number = 10,
    q: string = ""
  ): Promise<PaginatedBooks> => {
    try {
      const response = await axios.get<BookResponse>(`${API_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          per_page: perPage,
          q: q || undefined,
        },
      });
      if (!response.data.status || !response.data.books) {
        throw new Error(response.data.message || "Failed to fetch books");
      }
      return response.data.books;
    } catch (error: any) {
      console.error("Error fetching books:", {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  // Get a single book by ID
  getBookById: async (id: number, token: string): Promise<Book> => {
    try {
      const response = await axios.get<BookResponse>(`${API_URL}/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.status || !response.data.book) {
        throw new Error(response.data.message || "Book not found");
      }
      return response.data.book;
    } catch (error) {
      console.error(`Error fetching book ${id}:`, error);
      throw error;
    }
  },

  createBook: async (bookData: BookPayload, token: string): Promise<Book> => {
    try {
      console.log(
        "Sending POST request to:",
        `${API_URL}/books`,
        "with data:",
        bookData,
        "token:",
        token
      );
      const response = await axios.post<BookResponse>(
        `${API_URL}/books`,
        bookData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API response for createBook:", response.data);
      if (!response.data.status || !response.data.book) {
        throw new Error(response.data.message || "Failed to create book");
      }
      return response.data.book;
    } catch (error: any) {
      console.error("Error in createBook:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create book"
      );
    }
  },
  // Update a book
  updateBook: async (
    id: number,
    bookData: BookPayload,
    token: string
  ): Promise<Book> => {
    try {
      const response = await axios.put<BookResponse>(
        `${API_URL}/books/${id}`,
        bookData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.status || !response.data.book) {
        throw new Error(response.data.message || "Failed to update book");
      }
      return response.data.book;
    } catch (error) {
      console.error(`Error updating book ${id}:`, error);
      throw error;
    }
  },

  // Delete a book
  deleteBook: async (id: number, token: string): Promise<void> => {
    try {
      const response = await axios.delete<BookResponse>(
        `${API_URL}/books/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.status) {
        throw new Error(response.data.message || "Failed to delete book");
      }
    } catch (error) {
      console.error(`Error deleting book ${id}:`, error);
      throw error;
    }
  },
};
