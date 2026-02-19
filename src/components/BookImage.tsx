'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { BookOpen } from 'lucide-react'

interface BookImageProps {
  src: string | null
  alt: string
  className?: string
  priority?: boolean
}


export default function BookImage({ src, alt, className }: BookImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div 
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, var(--color-cream) 0%, var(--color-cream-dark) 100%)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        <BookOpen size={50} style={{ color: 'var(--color-primary)', opacity: 0.4 }} />
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 'var(--radius-xl)' }}>
      <Image
        src={src}
        alt={alt}
        className={className}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ 
          objectFit: 'contain',
          objectPosition: 'center',
          background: '#f8f5ef',
        }}
        onError={() => setError(true)}
      />
    </div>
  )
}
