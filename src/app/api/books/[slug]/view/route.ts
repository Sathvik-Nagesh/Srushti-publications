import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

// POST /api/books/[slug]/view - Increment view count (client-side beacon)
// This is called by client components to avoid DB writes on SSR/ISR
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Rate limit by IP to prevent abuse
    const ip = getClientIp(request)
    const rateCheck = checkRateLimit(`view:${ip}:${slug}`, {
      windowMs: 60000, // 1 minute
      maxRequests: 1   // Max 1 view count per minute per book per IP
    })
    
    if (!rateCheck.allowed) {
      // Silently return success - no need to tell client they're rate limited
      return NextResponse.json({ success: true, cached: true })
    }
    
    // Fire and forget - don't block on response
    // Use updateMany to avoid NotFound error if book doesn't exist
    await prisma.book.updateMany({
      where: { 
        slug,
        isActive: true 
      },
      data: { 
        viewCount: { increment: 1 } 
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    // Fail silently - view count is not critical
    console.error('View count error:', error)
    return NextResponse.json({ success: true })
  }
}
