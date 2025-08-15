import { useState, useCallback } from "react"
import {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  type BookPayload,
} from "../services/bookService"

export function useBooks() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [books, setBooks] = useState<BookPayload[]>([])

  // Fetch all books
  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getBooks()
      setBooks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  // Create a book
  const addBook = useCallback(async (bookData: BookPayload) => {
    setLoading(true)
    setError(null)
    try {
      await createBook(bookData)
      await fetchBooks() 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [fetchBooks])

  // Get a single book by id
  const fetchBookById = useCallback(async (id: number): Promise<BookPayload | null> => {
    setLoading(true)
    setError(null)
    try {
      const book = await getBook(id)
      return book
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Update a book
  const editBook = useCallback(async (id: number, bookData: BookPayload) => {
    setLoading(true)
    setError(null)
    try {
      await updateBook(id, bookData)
      await fetchBooks() 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [fetchBooks])

  // Delete a book
  const removeBook = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await deleteBook(id)
      await fetchBooks() 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [fetchBooks])

  return {
    books,
    loading,
    error,
    fetchBooks,
    addBook,
    fetchBookById,
    editBook,
    removeBook,
  }
}
