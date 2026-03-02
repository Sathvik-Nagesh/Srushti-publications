import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default cloudinary

/**
 * Upload an image to Cloudinary
 * @param file - Base64 encoded image or image URL
 * @param folder - Folder name in Cloudinary
 * @returns Upload result with secure URL
 */
export async function uploadImage(
  file: string,
  folder: string = 'books'
): Promise<{ url: string; publicId: string }> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `srushti-publications/${folder}`,
      resource_type: 'image',
      transformation: [
        { width: 1200, height: 1800, crop: 'limit' }, // Max dimensions (retina-ready)
        { quality: 'auto', fetch_format: 'auto' }, // Auto-optimize
      ],
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return false
  }
}

/**
 * Generate optimized image URL with transformations
 * @param publicId - The public ID of the image
 * @param options - Transformation options
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: 'fill' | 'fit' | 'limit' | 'thumb'
  } = {}
): string {
  const { width = 400, height = 600, crop = 'fill' } = options

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality: 'auto',
    fetch_format: 'auto',
  })
}

/**
 * Generate a thumbnail URL
 */
export function getThumbnailUrl(publicId: string): string {
  return getOptimizedImageUrl(publicId, { width: 200, height: 300, crop: 'fill' })
}
