'use client'

import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { Book, Category } from './types'

// IndexedDB Schema
interface SrushtiDB extends DBSchema {
  books: {
    key: string
    value: Book & { cachedAt: number }
    indexes: { 'by-category': string; 'by-slug': string }
  }
  categories: {
    key: string
    value: Category & { cachedAt: number }
  }
  metadata: {
    key: string
    value: { key: string; value: any; updatedAt: number }
  }
}

// Cache TTL settings (in milliseconds)
const CACHE_TTL = {
  books: 30 * 60 * 1000,      // 30 minutes
  categories: 60 * 60 * 1000,  // 1 hour
  searches: 10 * 60 * 1000,    // 10 minutes
}

let dbPromise: Promise<IDBPDatabase<SrushtiDB>> | null = null

// Initialize IndexedDB
function getDB(): Promise<IDBPDatabase<SrushtiDB>> {
  if (!dbPromise) {
    dbPromise = openDB<SrushtiDB>('srushti-cache', 1, {
      upgrade(db) {
        // Books store
        const bookStore = db.createObjectStore('books', { keyPath: 'id' })
        bookStore.createIndex('by-category', 'categoryId')
        bookStore.createIndex('by-slug', 'slug')
        
        // Categories store
        db.createObjectStore('categories', { keyPath: 'id' })
        
        // Metadata store for misc caching
        db.createObjectStore('metadata', { keyPath: 'key' })
      },
    })
  }
  return dbPromise
}

// ============ BOOKS CACHE ============

export async function getCachedBooks(): Promise<Book[] | null> {
  try {
    const db = await getDB()
    const books = await db.getAll('books')
    
    if (books.length === 0) return null
    
    // Check if cache is still valid
    const now = Date.now()
    const validBooks = books.filter(b => now - b.cachedAt < CACHE_TTL.books)
    
    if (validBooks.length === 0) return null
    
    // Remove cachedAt from returned books
    return validBooks.map(({ cachedAt, ...book }) => book as Book)
  } catch (error) {
    console.error('Error getting cached books:', error)
    return null
  }
}

export async function cacheBooks(books: Book[]): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction('books', 'readwrite')
    const now = Date.now()
    
    await Promise.all([
      ...books.map(book => tx.store.put({ ...book, cachedAt: now })),
      tx.done
    ])
  } catch (error) {
    console.error('Error caching books:', error)
  }
}

export async function getCachedBookBySlug(slug: string): Promise<Book | null> {
  try {
    const db = await getDB()
    const book = await db.getFromIndex('books', 'by-slug', slug)
    
    if (!book) return null
    if (Date.now() - book.cachedAt > CACHE_TTL.books) return null
    
    const { cachedAt, ...bookData } = book
    return bookData as Book
  } catch (error) {
    console.error('Error getting cached book:', error)
    return null
  }
}

export async function getCachedBooksByCategory(categoryId: string): Promise<Book[] | null> {
  try {
    const db = await getDB()
    const books = await db.getAllFromIndex('books', 'by-category', categoryId)
    
    if (books.length === 0) return null
    
    const now = Date.now()
    const validBooks = books.filter(b => now - b.cachedAt < CACHE_TTL.books)
    
    if (validBooks.length === 0) return null
    
    return validBooks.map(({ cachedAt, ...book }) => book as Book)
  } catch (error) {
    console.error('Error getting cached books by category:', error)
    return null
  }
}

// ============ CATEGORIES CACHE ============

export async function getCachedCategories(): Promise<Category[] | null> {
  try {
    const db = await getDB()
    const categories = await db.getAll('categories')
    
    if (categories.length === 0) return null
    
    const now = Date.now()
    const validCategories = categories.filter(c => now - c.cachedAt < CACHE_TTL.categories)
    
    if (validCategories.length === 0) return null
    
    return validCategories.map(({ cachedAt, ...cat }) => cat as Category)
  } catch (error) {
    console.error('Error getting cached categories:', error)
    return null
  }
}

export async function cacheCategories(categories: Category[]): Promise<void> {
  try {
    const db = await getDB()
    const tx = db.transaction('categories', 'readwrite')
    const now = Date.now()
    
    await Promise.all([
      ...categories.map(cat => tx.store.put({ ...cat, cachedAt: now })),
      tx.done
    ])
  } catch (error) {
    console.error('Error caching categories:', error)
  }
}

// ============ METADATA CACHE (for search results, etc) ============

export async function getCachedMetadata<T>(key: string): Promise<T | null> {
  try {
    const db = await getDB()
    const data = await db.get('metadata', key)
    
    if (!data) return null
    if (Date.now() - data.updatedAt > CACHE_TTL.searches) return null
    
    return data.value as T
  } catch (error) {
    console.error('Error getting cached metadata:', error)
    return null
  }
}

export async function cacheMetadata(key: string, value: any): Promise<void> {
  try {
    const db = await getDB()
    await db.put('metadata', { key, value, updatedAt: Date.now() })
  } catch (error) {
    console.error('Error caching metadata:', error)
  }
}

// ============ CACHE INVALIDATION ============

export async function clearBooksCache(): Promise<void> {
  try {
    const db = await getDB()
    await db.clear('books')
  } catch (error) {
    console.error('Error clearing books cache:', error)
  }
}

export async function clearCategoriesCache(): Promise<void> {
  try {
    const db = await getDB()
    await db.clear('categories')
  } catch (error) {
    console.error('Error clearing categories cache:', error)
  }
}

export async function clearAllCache(): Promise<void> {
  try {
    const db = await getDB()
    await Promise.all([
      db.clear('books'),
      db.clear('categories'),
      db.clear('metadata')
    ])
  } catch (error) {
    console.error('Error clearing all cache:', error)
  }
}

// ============ CACHE STATS ============

export async function getCacheStats(): Promise<{
  books: number
  categories: number
  metadata: number
}> {
  try {
    const db = await getDB()
    return {
      books: await db.count('books'),
      categories: await db.count('categories'),
      metadata: await db.count('metadata'),
    }
  } catch (error) {
    console.error('Error getting cache stats:', error)
    return { books: 0, categories: 0, metadata: 0 }
  }
}
