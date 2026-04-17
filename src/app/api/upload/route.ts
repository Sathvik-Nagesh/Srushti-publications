import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import { verifyAdminSession } from '@/lib/auth-edge'

// Whitelist allowed folders to prevent path traversal
const ALLOWED_FOLDERS = ['books', 'authors', 'categories', 'banners', 'products', 'site']

// POST /api/upload - Upload an image
export async function POST(request: NextRequest) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // 🛡️ SECURITY: Prevent Out-Of-Memory (OOM) attacks by checking the content-length BEFORE processing the body streams
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > 12 * 1024 * 1024) { // 12MB limit loosely
      return NextResponse.json(
        { success: false, error: 'Payload size limit exceeded' },
        { status: 413 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null

    // Sentinel: Validate folder to prevent path traversal
    if (folder && !ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json(
        { success: false, error: `Invalid folder. Allowed: ${ALLOWED_FOLDERS.join(', ')}` },
        { status: 400 }
      )
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF.' },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 🛡️ SECURITY: Magic byte validation to prevent file type spoofing
    const magicHex = buffer.toString('hex', 0, 4).toUpperCase()
    let verifiedMimeType = ''

    // JPEG (FFD8FF), PNG (89504E47), GIF (47494638)
    if (magicHex.startsWith('FFD8FF')) verifiedMimeType = 'image/jpeg'
    else if (magicHex.startsWith('89504E47')) verifiedMimeType = 'image/png'
    else if (magicHex.startsWith('47494638')) verifiedMimeType = 'image/gif'
    else if (magicHex.startsWith('52494646')) {
      // WebP (RIFF....WEBP)
      const webpMagic = buffer.toString('hex', 8, 12).toUpperCase()
      if (webpMagic === '57454250') verifiedMimeType = 'image/webp'
    }

    if (!verifiedMimeType) {
      return NextResponse.json(
        { success: false, error: 'Invalid file content. Spoofed file type detected.' },
        { status: 400 }
      )
    }

    const base64 = `data:${verifiedMimeType};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await uploadImage(base64, folder || 'books')

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
      },
      message: 'Image uploaded successfully',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - Delete an image
export async function DELETE(request: NextRequest) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No publicId provided' },
        { status: 400 }
      )
    }

    const deleted = await deleteImage(publicId)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete image' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
