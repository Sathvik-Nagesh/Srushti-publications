'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader, ImageIcon, Check, Crop as CropIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import ImageCropper from './ImageCropper'

interface ImageUploadProps {
  value?: string
  onChange: (url: string, publicId?: string) => void
  onFileChange?: (file: File) => void // New prop for deferred upload
  onRemove?: () => void
  folder?: string
  aspectRatio?: 'book' | 'square' | 'banner'
  label?: string
  helpText?: string
}

export default function ImageUpload({
  value,
  onChange,
  onFileChange,
  onRemove,
  folder = 'books',
  aspectRatio = 'book',
  label = 'ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
  helpText = 'JPEG, PNG, WebP ಅಥವಾ GIF. ಗರಿಷ್ಠ 5MB.'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Cropping State
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)

  const aspectRatios = {
    book: 3 / 4,
    square: 1 / 1,
    banner: 16 / 9
  }

  const handleFileSelect = async (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('ದಯವಿಟ್ಟು JPEG, PNG, WebP ಅಥವಾ GIF ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('ಫೈಲ್ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ. ಗರಿಷ್ಠ 5MB ಅನುಮತಿಸಲಾಗಿದೆ.')
      return
    }
    
    // Store file temporarily
    setCurrentFile(file)
    
    // Create Object URL for cropping
    const objectUrl = URL.createObjectURL(file)
    setCropImageSrc(objectUrl)
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!currentFile) return
    
    // Convert Blob to File
    const croppedFile = new File([croppedBlob], currentFile.name, { type: 'image/jpeg' })
    
    // Clean up
    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc)
    setCropImageSrc(null)
    
    if (onFileChange) {
      // DEFERRED MODE: Pass file to parent
      const previewUrl = URL.createObjectURL(croppedFile)
      onFileChange(croppedFile)
      onChange(previewUrl) // Show local preview immediately
    } else {
      // LEGACY MODE: Upload Immediately
      uploadFile(croppedFile)
    }
  }

  const handleCropCancel = () => {
    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc)
    setCropImageSrc(null)
    setCurrentFile(null)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Upload failed')
      }

      onChange(data.data.url, data.data.publicId)
      toast.success('ಚಿತ್ರ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
    }
    onChange('')
    if (onFileChange) {
        // We might want to clear the file in parent too, pass null if specific type allows, 
        // or assumption is parent clears file when url is empty. 
        // But onFileChange signature expects File. 
        // We really should allow passing null or handle logic in parent.
        // For now, parent `onChange('')` is enough to clear the URL state, parent should handle file state cleanup if needed or just ignore old file if url is empty.
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="image-upload">
      <label className="label" style={{ display: 'block', marginBottom: '0.5rem' }}>
        {label}
      </label>

      {value ? (
        // Image Preview
        <div
          style={{
            position: 'relative',
            aspectRatio: aspectRatios[aspectRatio],
            maxWidth: aspectRatio === 'banner' ? '100%' : '200px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '2px solid var(--color-border)',
          }}
        >
          <Image
            src={value}
            alt="Uploaded image"
            fill
            style={{ objectFit: 'cover' }}
            unoptimized={value.startsWith('blob:')} // Important for local preview
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(220,38,38,0.9)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.7)')}
          >
            <X size={18} />
          </button>
          
          {/* Deferred Upload Badge */}
          {onFileChange && value.startsWith('blob:') && (
             <div
             style={{
               position: 'absolute',
               bottom: '8px',
               left: '8px',
               background: 'var(--color-warning)', // Yellow/Orange
               color: 'white',
               padding: '4px 8px',
               borderRadius: 'var(--radius-sm)',
               fontSize: '0.75rem',
               display: 'flex',
               alignItems: 'center',
               gap: '4px',
               fontWeight: 600
             }}
           >
             <CropIcon size={14} />
             Save to Upload
           </div>
          )}
          
          {/* Default Uploaded Badge */}
          {(!onFileChange || !value.startsWith('blob:')) && (
            <div
            style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                background: 'rgba(16,185,129,0.9)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
            }}
            >
            <Check size={14} />
            ಅಪ್‌ಲೋಡ್ ಆಗಿದೆ
            </div>
          )}

        </div>
      ) : (
        // Upload Zone
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            position: 'relative',
            aspectRatio: aspectRatios[aspectRatio],
            maxWidth: aspectRatio === 'banner' ? '100%' : '200px',
            border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-lg)',
            background: isDragging ? 'var(--color-primary)10' : 'var(--color-bg-alt)',
            cursor: isUploading ? 'wait' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem',
            transition: 'all 0.2s ease',
          }}
        >
          {isUploading ? (
            <>
              <Loader size={32} className="spin" style={{ color: 'var(--color-primary)' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', margin: 0 }}>
                ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ... {uploadProgress}%
              </p>
              <div
                style={{
                  width: '80%',
                  height: '4px',
                  background: 'var(--color-border)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'var(--color-primary)',
                    transition: 'width 0.2s ease',
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'var(--color-primary)15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isDragging ? (
                  <ImageIcon size={24} style={{ color: 'var(--color-primary)' }} />
                ) : (
                  <Upload size={24} style={{ color: 'var(--color-primary)' }} />
                )}
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0, textAlign: 'center' }}>
                {isDragging ? 'ಇಲ್ಲಿ ಬಿಡಿ' : 'ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಡ್ರ್ಯಾಗ್ ಮಾಡಿ'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0, textAlign: 'center' }}>
                {helpText}
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        style={{ display: 'none' }}
      />
      
      {cropImageSrc && (
        <ImageCropper
            imageSrc={cropImageSrc}
            aspectRatio={aspectRatios[aspectRatio]}
            onCancel={handleCropCancel}
            onCropComplete={handleCropComplete}
        />
      )}

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
