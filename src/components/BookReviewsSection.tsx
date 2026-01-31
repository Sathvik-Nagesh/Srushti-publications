'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, User, CheckCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatDate } from '@/lib/utils'

interface Review {
  id: string
  rating: number
  title?: string
  comment: string
  authorName: string
  isVerified: boolean
  createdAt: string
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
}

interface BookReviewsProps {
  bookId: string
  bookTitle: string
}

export default function BookReviews({ bookId, bookTitle }: BookReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({ averageRating: 0, totalReviews: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    authorName: '',
    authorEmail: '',
    orderId: ''
  })

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?bookId=${bookId}`)
        const data = await response.json()
        
        if (data.success) {
          setReviews(data.data)
          setStats(data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchReviews()
  }, [bookId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId,
          ...formData
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message || 'ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಲಾಗಿದೆ!')
        setShowForm(false)
        setFormData({
          rating: 5,
          title: '',
          comment: '',
          authorName: '',
          authorEmail: '',
          orderId: ''
        })
      } else {
        toast.error(data.error || 'ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಲು ವಿಫಲ')
      }
    } catch (error) {
      toast.error('ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಲು ವಿಫಲ')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setFormData(prev => ({ ...prev, rating: star })) : undefined}
            style={{
              background: 'none',
              border: 'none',
              cursor: interactive ? 'pointer' : 'default',
              padding: 0
            }}
          >
            <Star
              size={interactive ? 24 : 16}
              fill={star <= rating ? '#fbbf24' : 'transparent'}
              stroke={star <= rating ? '#fbbf24' : '#d1d5db'}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div style={{ marginTop: '3rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            ಗ್ರಾಹಕರ ವಿಮರ್ಶೆಗಳು
          </h2>
          {stats.totalReviews > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {renderStars(Math.round(stats.averageRating))}
              <span style={{ fontWeight: 600 }}>{stats.averageRating.toFixed(1)}</span>
              <span style={{ color: 'var(--color-text-light)' }}>
                ({stats.totalReviews} ವಿಮರ್ಶೆಗಳು)
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Star size={18} />
          ವಿಮರ್ಶೆ ಬರೆಯಿರಿ
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--color-cream-light)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem'
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            &quot;{bookTitle}&quot; ಬಗ್ಗೆ ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              ರೇಟಿಂಗ್ *
            </label>
            {renderStars(formData.rating, true)}
          </div>
          
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div>
              <label className="label">ನಿಮ್ಮ ಹೆಸರು *</label>
              <input
                type="text"
                className="input"
                value={formData.authorName}
                onChange={e => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">ಇ-ಮೇಲ್ *</label>
              <input
                type="email"
                className="input"
                value={formData.authorEmail}
                onChange={e => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <label className="label">ಶೀರ್ಷಿಕೆ (ಐಚ್ಛಿಕ)</label>
            <input
              type="text"
              className="input"
              placeholder="ಒಂದೇ ವಾಕ್ಯದಲ್ಲಿ ಸಾರಾಂಶ"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <label className="label">ನಿಮ್ಮ ವಿಮರ್ಶೆ *</label>
            <textarea
              className="input"
              rows={4}
              placeholder="ಈ ಪುಸ್ತಕದ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನುಭವ ಮತ್ತು ಅಭಿಪ್ರಾಯವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ..."
              value={formData.comment}
              onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              required
              style={{ resize: 'vertical' }}
            />
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <label className="label">ಆರ್ಡರ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ - ಪರಿಶೀಲನೆಗಾಗಿ)</label>
            <input
              type="text"
              className="input"
              placeholder="ORD-XXXXX"
              value={formData.orderId}
              onChange={e => setFormData(prev => ({ ...prev, orderId: e.target.value }))}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              ✓ ಆರ್ಡರ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿದರೆ "ಪರಿಶೀಲಿತ ಖರೀದಿ" ಬ್ಯಾಡ್ಜ್ ಸಿಗುತ್ತದೆ
            </p>
          </div>
          
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {isSubmitting ? (
                <span className="spinner" style={{ width: 20, height: 20 }} />
              ) : (
                <Send size={18} />
              )}
              ಸಲ್ಲಿಸಿ
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-outline"
            >
              ರದ್ದುಮಾಡಿ
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <span className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      ) : reviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--color-bg-alt)',
          borderRadius: 'var(--radius-xl)'
        }}>
          <Star size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.5rem' }}>
            ಇನ್ನೂ ವಿಮರ್ಶೆಗಳಿಲ್ಲ
          </p>
          <p style={{ color: 'var(--color-text-light)' }}>
            ಮೊದಲ ವಿಮರ್ಶೆ ಬರೆಯುವವರು ನೀವಾಗಿ!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {reviews.map(review => (
            <div
              key={review.id}
              style={{
                background: 'white',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600
                    }}>
                      {review.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span style={{ fontWeight: 600 }}>{review.authorName}</span>
                      {review.isVerified && (
                        <span style={{
                          marginLeft: '0.5rem',
                          background: '#10b98120',
                          color: '#10b981',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <CheckCircle size={12} />
                          ಪರಿಶೀಲಿತ ಖರೀದಿ
                        </span>
                      )}
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {formatDate(review.createdAt)}
                </span>
              </div>
              
              {review.title && (
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{review.title}</h4>
              )}
              
              <p style={{ color: 'var(--color-text-light)', lineHeight: 1.6 }}>
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
