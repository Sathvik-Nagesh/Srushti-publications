'use client'

import { useState, useRef, useEffect } from 'react'
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { X, Check, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

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
  const [rotate, setRotate] = useState(0)

  // Initial load
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspectRatio))
  }

  const getCroppedImg = async () => {
    const image = imgRef.current
    const crop = completedCrop
    
    if (!image || !crop) return
    
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    
    // Set canvas size to the cropped area
    const pixelRatio = window.devicePixelRatio
    canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio)
    
    ctx.scale(pixelRatio, pixelRatio)
    ctx.imageSmoothingQuality = 'high'
    
    const cropX = crop.x * scaleX
    const cropY = crop.y * scaleY
    
    const centerX = image.naturalWidth / 2
    const centerY = image.naturalHeight / 2
    
    // Save, rotate, draw, restore
    ctx.save()

    // Move to center of canvas (to rotate around center if needed, but here we just crop)
    // Actually, rotation complicates "crop coordinates". 
    // For simplicity, we implement simple crop first.
    // If we support rotation + crop, we need more math. 
    // Given the prompt "Resize", I'll stick to simple crop.
    
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
      }, 'image/jpeg', 0.95)
    })
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        maxWidth: '90vw',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '600px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>ಚಿತ್ರವನ್ನು ಹೊಂದಿಸಿ (Crop/Resize)</h3>
          <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
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
            aspect={aspectRatio}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imageSrc}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, maxHeight: '60vh', maxWidth: '100%' }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>

        {/* Controls (Optional: Zoom) */}
        {/* Not strictly implemented yet to keep simple, just basic crop */}
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
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
  )
}
