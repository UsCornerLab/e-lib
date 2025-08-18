import { useState, useCallback } from "react"
import { bookServices } from "../services/bookService"
import type { Book, BookPayload } from "../services/bookService"

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  // Fetch all books
  const fetchBooks = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setError("No token found")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await bookServices.getBooks(token)
      setBooks(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch books")
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch single book
  const fetchBook = useCallback(async (id: number) => {
    const token = getToken()
    if (!token) {
      setError("No token found")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await bookServices.getBookById(id, token)
      setBook(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch book")
    } finally {
      setLoading(false)
    }
  }, [])

  // Create book
  const createBook = useCallback(async (payload: BookPayload) => {
    const token = getToken()
    if (!token) throw new Error("No token found")
    setLoading(true)
    setError(null)
    try {
      const newBook = await bookServices.createBook(payload, token)
      setBooks((prev) => [...prev, newBook])
      return newBook
    } catch (err: any) {
      setError(err.message || "Failed to create book")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Update book
  const updateBook = useCallback(async (id: number, payload: BookPayload) => {
    const token = getToken()
    if (!token) throw new Error("No token found")
    setLoading(true)
    setError(null)
    try {
      const updated = await bookServices.updateBook(id, payload, token)
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)))
      return updated
    } catch (err: any) {
      setError(err.message || "Failed to update book")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete book
  const deleteBook = useCallback(async (id: number) => {
    const token = getToken()
    if (!token) throw new Error("No token found")
    setLoading(true)
    setError(null)
    try {
      await bookServices.deleteBook(id, token)
      setBooks((prev) => prev.filter((b) => b.id !== id))
    } catch (err: any) {
      setError(err.message || "Failed to delete book")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

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
  }
}

export type { Book, BookPayload }
