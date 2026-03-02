'use client'

import { useState, useRef } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { X, Check, ZoomIn, ZoomOut, Unlock, Lock } from 'lucide-react'

// Helper to center the crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      { unit: '%', width: 90 },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

interface ImageCropperProps {
  imageSrc: string
  aspectRatio: number
  onCancel: () => void
  onCropComplete: (croppedBlob: Blob) => void
}

export default function ImageCropper({ imageSrc, aspectRatio, onCancel, onCropComplete }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)
  
  const [scale, setScale] = useState(1)
  const [lockAspect, setLockAspect] = useState(true)

  // Initial load
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspectRatio))
  }

  const toggleAspectLock = () => {
    const newLock = !lockAspect
    setLockAspect(newLock)
    
    // If re-locking, recenter with the original aspect ratio
    if (newLock && imgRef.current) {
      const { width, height } = imgRef.current
      setCrop(centerAspectCrop(width, height, aspectRatio))
    }
  }

  const handleZoomIn = () => setScale(s => Math.min(s + 0.1, 3))
  const handleZoomOut = () => setScale(s => Math.max(s - 0.1, 0.5))

  const getCroppedImg = async () => {
    const image = imgRef.current
    const cropData = completedCrop
    
    if (!image || !cropData) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    
    // Set canvas size to the cropped area
    const pixelRatio = window.devicePixelRatio
    canvas.width = Math.floor(cropData.width * scaleX * pixelRatio)
    canvas.height = Math.floor(cropData.height * scaleY * pixelRatio)
    
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'
    
    const cropX = cropData.x * scaleX
    const cropY = cropData.y * scaleY
    
    ctx.save()
    ctx.translate(-cropX, -cropY)
    
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    )
    
    ctx.restore()
    
    // Output as blob
    return new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          onCropComplete(blob)
        }
        resolve()
      }, 'image/jpeg', 0.92)
    })
  }

  // "Skip crop" — upload the original image as-is
  const handleSkipCrop = async () => {
    try {
      const response = await fetch(imageSrc)
      const blob = await response.blob()
      onCropComplete(blob)
    } catch {
      // Fallback: if fetch fails (CORS), use canvas to extract full image
      const image = imgRef.current
      if (!image) return
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(image, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) onCropComplete(blob)
      }, 'image/jpeg', 0.92)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        maxWidth: '95vw',
        maxHeight: '95vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '650px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>ಚಿತ್ರವನ್ನು ಹೊಂದಿಸಿ (Crop/Resize)</h3>
          <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>
        
        {/* Toolbar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          padding: '0.5rem 0.75rem',
          background: 'var(--color-bg-alt)',
          borderRadius: 'var(--radius-lg)',
          flexWrap: 'wrap'
        }}>
          {/* Aspect Lock Toggle */}
          <button 
            type="button"
            onClick={toggleAspectLock}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              border: `1.5px solid ${lockAspect ? 'var(--color-primary)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-md)',
              background: lockAspect ? 'var(--color-primary)10' : 'white',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: lockAspect ? 'var(--color-primary)' : 'var(--color-text-light)'
            }}
          >
            {lockAspect ? <Lock size={14} /> : <Unlock size={14} />}
            {lockAspect ? '3:4 Locked' : 'Free Crop'}
          </button>

          <div style={{ width: '1px', height: '24px', background: 'var(--color-border)' }} />

          {/* Zoom Controls */}
          <button 
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32,
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'white',
              cursor: scale <= 0.5 ? 'not-allowed' : 'pointer',
              opacity: scale <= 0.5 ? 0.4 : 1
            }}
          >
            <ZoomOut size={16} />
          </button>
          
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', minWidth: '3rem', textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          
          <button 
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 3}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32,
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              background: 'white',
              cursor: scale >= 3 ? 'not-allowed' : 'pointer',
              opacity: scale >= 3 ? 0.4 : 1
            }}
          >
            <ZoomIn size={16} />
          </button>
        </div>
        
        <div style={{ 
          flex: 1, 
          minHeight: 0, 
          overflow: 'auto', 
          display: 'flex', 
          justifyContent: 'center',
          background: '#f3f4f6',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem'
        }}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={lockAspect ? aspectRatio : undefined}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              style={{ transform: `scale(${scale})`, maxHeight: '55vh', maxWidth: '100%', transformOrigin: 'center center' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            onClick={handleSkipCrop} 
            className="btn btn-ghost"
            style={{ fontSize: '0.875rem' }}
          >
            ✨ ಕ್ರಾಪ್ ಬಿಟ್ಟುಬಿಡಿ (Skip Crop)
          </button>
          
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={onCancel} className="btn btn-ghost">ರದ್ದುಮಾಡಿ</button>
            <button 
              type="button"
              onClick={getCroppedImg} 
              className="btn btn-primary"
              disabled={!completedCrop?.width || !completedCrop?.height}
            >
              <Check size={18} /> ಪೂರ್ಣಗೊಳಿಸಿ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
