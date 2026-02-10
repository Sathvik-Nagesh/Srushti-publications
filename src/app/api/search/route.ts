import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkRateLimit, getCached, setCache, API_RATE_LIMITS, getClientIp } from '@/lib/rateLimit'

// Fuzzy search helper - calculates similarity between strings
// Optimized to O(min(m,n)) space complexity
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  // Swap to ensure a is shorter to minimize memory
  if (a.length > b.length) {
    const tmp = a
    a = b
    b = tmp
  }

  const row = new Int32Array(a.length + 1)
  // Initialize first row
  for (let i = 0; i <= a.length; i++) {
    row[i] = i
  }

  for (let i = 1; i <= b.length; i++) {
    let prev = i
    for (let j = 1; j <= a.length; j++) {
      let val: number
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        val = row[j - 1] // match
      } else {
        val = Math.min(row[j - 1] + 1, // substitution
          prev + 1,       // insertion
          row[j] + 1)     // deletion
      }
      row[j - 1] = prev
      prev = val
    }
    row[a.length] = prev
  }
  return row[a.length]
}

// Calculate similarity score (0-1, higher is better)
function similarityScore(query: string, text: string): number {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  
  // Exact match
  if (t.includes(q)) return 1.0
  
  // Check if words are similar
  const queryWords = q.split(/\s+/)
  const textWords = t.split(/\s+/)
  
  let totalScore = 0
  for (const qWord of queryWords) {
    let bestMatch = 0
    for (const tWord of textWords) {
      // Skip very short words
      if (qWord.length < 2 || tWord.length < 2) continue
      
      const distance = levenshteinDistance(qWord, tWord)
      const maxLen = Math.max(qWord.length, tWord.length)
      const wordScore = 1 - (distance / maxLen)
      
      // Only count if reasonably similar (>60% match)
      if (wordScore > 0.6 && wordScore > bestMatch) {
        bestMatch = wordScore
      }
    }
    totalScore += bestMatch
  }
  
  return totalScore / queryWords.length
}

// GET /api/search - Fuzzy search books
export async function GET(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = getClientIp(request)
    
    // Check rate limit
    const rateCheck = checkRateLimit(`search:${ip}`, API_RATE_LIMITS.search)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please slow down.' },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateCheck.resetIn / 1000).toString(),
            'X-RateLimit-Remaining': '0'
          }
        }
      )
    }

    const { searchParams } = new URL(request.url)
    // Sentinel: Truncate query to 100 chars to prevent ReDoS/DoS in fuzzy search
    const query = (searchParams.get('q')?.trim() || '').slice(0, 100)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 20) // Max 20 results
    const categorySlug = searchParams.get('category')

    // Sentinel: Limit query length to prevent ReDoS and high CPU usage
    if (query.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Query too long. Maximum 100 characters.' },
        { status: 400 }
      )
    }

    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        meta: { query, total: 0 }
      })
    }

    // Check cache first
    const cacheKey = `search:${query}:${limit}:${categorySlug || ''}`
    const cached = getCached<unknown[]>(cacheKey)
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        meta: { query, total: cached.length, cached: true }
      })
    }

    // Build where clause for Prisma with optimized query
    const whereClause: Record<string, unknown> = {
      AND: [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { titleEn: { contains: query, mode: 'insensitive' } },
            { author: { contains: query, mode: 'insensitive' } },
            { authorEn: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { isbn: { contains: query, mode: 'insensitive' } }
          ]
        },
        { isActive: true }
      ]
    }

    // Add category filter if provided
    if (categorySlug) {
      (whereClause.AND as unknown[]).push({
        category: { slug: categorySlug }
      })
    }

    // Search with limit to prevent excessive data fetch
    const books = await prisma.book.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        titleEn: true,
        slug: true,
        author: true,
        authorEn: true,
        sellingPrice: true,
        mrp: true,
        coverImage: true,
        salesCount: true,
        category: {
          select: { name: true, slug: true }
        }
      },
      take: limit * 2, // Get more for fuzzy ranking
      orderBy: [
        { salesCount: 'desc' },
        { title: 'asc' }
      ]
    })

    // If no exact matches, try fuzzy search on a broader set
    let results = books
    if (books.length === 0) {
      // Fetch all active books for fuzzy matching (with limit to prevent overload)
      const allBooks = await prisma.book.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          titleEn: true,
          slug: true,
          author: true,
          authorEn: true,
          sellingPrice: true,
          mrp: true,
          coverImage: true,
          salesCount: true,
          category: {
            select: { name: true, slug: true }
          }
        },
        take: 200 // Limit for fuzzy search pool
      })

      // Score each book and filter by similarity
      const scored = allBooks.map(book => {
        const titleScore = similarityScore(query, book.title)
        const titleEnScore = book.titleEn ? similarityScore(query, book.titleEn) : 0
        const authorScore = similarityScore(query, book.author)
        const authorEnScore = book.authorEn ? similarityScore(query, book.authorEn) : 0
        
        const maxScore = Math.max(titleScore * 1.5, titleEnScore * 1.5, authorScore, authorEnScore)
        
        return { book, score: maxScore }
      })
        .filter(item => item.score > 0.5) // Only keep reasonably similar
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)

      results = scored.map(item => item.book)
    }

    // Transform to match expected interface
    const transformedBooks = results.slice(0, limit).map(book => ({
      id: book.id,
      title: book.title,
      slug: book.slug,
      author: book.author,
      price: book.sellingPrice,
      originalPrice: book.mrp,
      image: book.coverImage,
      category: book.category?.name
    }))

    // Cache results for 30 seconds
    setCache(cacheKey, transformedBooks, 30000)

    return NextResponse.json({
      success: true,
      data: transformedBooks,
      meta: { 
        query, 
        total: transformedBooks.length,
        fuzzy: books.length === 0 && results.length > 0
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}
