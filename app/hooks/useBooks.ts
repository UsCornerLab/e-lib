import { useState, useCallback } from "react"
import { bookServices } from "../services/bookService"
import type { Book, BookPayload, PaginatedBooks } from "../services/bookService"

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [pagination, setPagination] = useState<PaginatedBooks | null>(null);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [query, setQuery] = useState<string>("");

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  // Fetch all books
  // Fetch paginated books
  const fetchBooks = useCallback(
    async (p: number = 1, pp: number = 10, q: string = "") => {
      const token = getToken();
      if (!token) {
        setError("No token found");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await bookServices.getBooks(token, p, pp, q);
        setBooks(data.data);
        setPagination(data);
        setPage(p);
        setPerPage(pp);
        setQuery(q);
      } catch (err: any) {
        setError(err.message || "Failed to fetch books");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Fetch single book
  const fetchBook = useCallback(async (id: number) => {
    const token = getToken();
    if (!token) {
      setError("No token found");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await bookServices.getBookById(id, token);
      setBook(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch book");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create book
  // Create book -> refetch current page
  const createBook = useCallback(
    async (payload: BookPayload) => {
      const token = getToken();
      if (!token) throw new Error("No token found");
      setLoading(true);
      setError(null);
      try {
        const newBook = await bookServices.createBook(payload, token);
        // naive approach: refetch current page
        await fetchBooks(page, perPage, query);
        return newBook;
      } catch (err: any) {
        setError(err.message || "Failed to create book");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchBooks, page, perPage, query]
  );

  // Update book -> refetch current page
  const updateBook = useCallback(
    async (id: number, payload: BookPayload) => {
      const token = getToken();
      if (!token) throw new Error("No token found");
      setLoading(true);
      setError(null);
      try {
        const updated = await bookServices.updateBook(id, payload, token);
        await fetchBooks(page, perPage, query);
        return updated;
      } catch (err: any) {
        setError(err.message || "Failed to update book");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchBooks, page, perPage, query]
  );


  // Delete book -> refetch current page
  const deleteBook = useCallback(
    async (id: number) => {
      const token = getToken();
      if (!token) throw new Error("No token found");
      setLoading(true);
      setError(null);
      try {
        await bookServices.deleteBook(id, token);
        // If the current page becomes empty because of deletion, try to load previous page
        const nextPage = (() => {
          if (!pagination) return page;
          const remaining = pagination.total - 1;
          const maxPage = Math.max(1, Math.ceil(remaining / perPage));
          return Math.min(page, maxPage);
        })();
        await fetchBooks(nextPage, perPage, query);
      } catch (err: any) {
        setError(err.message || "Failed to delete book");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchBooks, page, perPage, pagination, query]
  );

  return {
    books,
    book,
    loading,
    error,
    fetchBooks,
    fetchBook,
    createBook,
    updateBook,
    deleteBook,
    // expose pagination helpers & state
    pagination,
    page,
    perPage,
    query,
    setPage,
    setPerPage,
    setQuery,
  };
}

export type { Book, BookPayload }
