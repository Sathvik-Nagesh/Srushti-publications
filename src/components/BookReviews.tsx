'use client'

import { useState, useEffect, useCallback } from 'react'
import { Star, ThumbsUp, MessageSquare, User, Check, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

interface Review {
  id: string
  authorName: string // Changed from userName to match API
  rating: number
  title: string
  comment: string
  createdAt: string
  helpful: number // Note: API doesn't support 'helpful' yet, might need schema update or ignore
  isVerified: boolean // Changed from verified
}

interface BookReviewsProps {
  bookId: string
  bookTitle: string
}

// Star Rating Component
function StarRating({ 
  rating, 
  onRatingChange, 
  interactive = false,
  size = 20 
}: { 
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
  size?: number
}) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRatingChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          style={{
            background: 'none',
            border: 'none',
            cursor: interactive ? 'pointer' : 'default',
            padding: 0,
            display: 'flex'
          }}
          disabled={!interactive}
        >
          <Star
            size={size}
            fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
            stroke={(hoverRating || rating) >= star ? '#f59e0b' : '#d1d5db'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}

// Rating Summary Component
function RatingSummary({ reviews, stats }: { reviews: Review[], stats: { averageRating: number, totalReviews: number } }) {
  const { totalReviews, averageRating } = stats
  
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: totalReviews > 0 
      ? (reviews.filter(r => r.rating === star).length / totalReviews) * 100 
      : 0
  }))

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: '2rem',
      padding: '1.5rem',
      background: 'var(--color-cream-light)',
      borderRadius: 'var(--radius-xl)'
    }}>
      {/* Average Rating */}
      <div style={{ textAlign: 'center', minWidth: '120px' }}>
        <p style={{ fontSize: '3rem', fontWeight: 700, margin: 0, lineHeight: 1 }}>
          {averageRating.toFixed(1)}
        </p>
        <StarRating rating={Math.round(averageRating)} />
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
          {totalReviews} ವಿಮರ್ಶೆಗಳು
        </p>
      </div>

      {/* Rating Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {ratingCounts.map(({ star, count, percentage }) => (
          <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', width: '20px' }}>{star}</span>
            <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
            <div style={{
              flex: 1,
              height: '8px',
              background: 'var(--color-border)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${percentage}%`,
                background: '#f59e0b',
                borderRadius: '4px'
              }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', width: '30px' }}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Single Review Card Component
function ReviewCard({ review }: { review: Review }) {
  const [helpfulClicked, setHelpfulClicked] = useState(false)

  const handleHelpful = () => {
    if (!helpfulClicked) {
      setHelpfulClicked(true)
      toast.success('ಧನ್ಯವಾದಗಳು!')
    }
  }

  return (
    <div style={{
      padding: '1.5rem',
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'var(--color-primary)15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={20} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <p style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {review.authorName}
              {review.isVerified && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  fontSize: '0.6875rem',
                  color: 'var(--color-success)',
                  background: '#10b98115',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <Check size={10} /> ಪರಿಶೀಲಿಸಲಾಗಿದೆ
                </span>
              )}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {new Date(review.createdAt).toLocaleDateString('kn-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size={16} />
      </div>

      {/* Content */}
      <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{review.title}</h4>
      <p style={{ color: 'var(--color-text-light)', margin: 0, lineHeight: 1.6 }}>
        {review.comment}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={handleHelpful}
          disabled={helpfulClicked}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            cursor: helpfulClicked ? 'default' : 'pointer',
            color: helpfulClicked ? 'var(--color-success)' : 'var(--color-text-muted)',
            fontSize: '0.875rem'
          }}
        >
          <ThumbsUp size={16} />
          ಉಪಯುಕ್ತ ({review.helpful || 0 + (helpfulClicked ? 1 : 0)})
        </button>
      </div>
    </div>
  )
}

// Write Review Form Component
function WriteReviewForm({ 
  bookId,
  bookTitle, 
  onSubmit, 
  onCancel 
}: { 
  bookId: string
  bookTitle: string
  onSubmit: (review: any) => Promise<boolean>
  onCancel: () => void
}) {
  const { customer, isAuthenticated } = useAuth()
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [userName, setUserName] = useState(customer?.name || '')
  const [userEmail, setUserEmail] = useState(customer?.email || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast.error('ದಯವಿಟ್ಟು ರೇಟಿಂಗ್ ನೀಡಿ')
      return
    }
    
    if (!userName.trim()) {
      toast.error('ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ')
      return
    }

    if (!userEmail.trim()) {
      toast.error('ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ')
      return
    }

    setIsSubmitting(true)
    
    const success = await onSubmit({ 
       bookId,
       rating, 
       title, 
       comment, 
       authorName: userName,
       authorEmail: userEmail
    })
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} style={{
      padding: '1.5rem',
      background: 'white',
      borderRadius: 'var(--radius-xl)',
      border: '2px solid var(--color-primary)30'
    }}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MessageSquare size={20} />
        "{bookTitle}" ಗೆ ವಿಮರ್ಶೆ ಬರೆಯಿರಿ
      </h3>

      {/* Rating */}
      <div style={{ marginBottom: '1rem' }}>
        <label className="label">ನಿಮ್ಮ ರೇಟಿಂಗ್ *</label>
        <StarRating rating={rating} onRatingChange={setRating} interactive size={32} />
      </div>

      {/* Name */}
      <div style={{ marginBottom: '1rem' }}>
        <label className="label">ನಿಮ್ಮ ಹೆಸರು *</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="input"
          placeholder="ನಿಮ್ಮ ಹೆಸರು"
          required
        />
      </div>

      {/* Email (Hidden if logged in? No, explicit helps) */}
      <div style={{ marginBottom: '1rem' }}>
        <label className="label">ನಿಮ್ಮ ಇಮೇಲ್ *</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="input"
          placeholder="ನಿಮ್ಮ ಇಮೇಲ್"
          required
          disabled={isAuthenticated && !!customer?.email} // Disable if logged in (from auth)
        />
      </div>

      {/* Title */}
      <div style={{ marginBottom: '1rem' }}>
        <label className="label">ವಿಮರ್ಶೆ ಶೀರ್ಷಿಕೆ</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="ಉದಾ: ಅದ್ಭುತ ಪುಸ್ತಕ!"
        />
      </div>

      {/* Comment */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="label">ನಿಮ್ಮ ವಿಮರ್ಶೆ *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="input"
          placeholder="ಪುಸ್ತಕದ ಬಗ್ಗೆ ನಿಮ್ಮ ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ..."
          rows={4}
          required
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
           {isSubmitting ? (
             <>
               <span className="spinner" style={{ width: 16, height: 16, marginRight: 8 }} />
               ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...
             </>
           ) : 'ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಿ'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
        >
          ರದ್ದುಮಾಡಿ
        </button>
      </div>
    </form>
  )
}

// Main Book Reviews Component
export default function BookReviews({ bookId, bookTitle }: BookReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 })
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest')

  const fetchReviews = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/reviews?bookId=${bookId}&limit=50`)
      const data = await response.json()
      
      if (data.success) {
        setReviews(data.data || [])
        setStats(data.stats || { averageRating: 0, totalReviews: 0 })
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast.error('ವಿಮರ್ಶೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ')
    } finally {
      setIsLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const handleSubmitReview = async (reviewData: any) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success(result.message || 'ವಿಮರ್ಶೆ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!')
        setShowWriteReview(false)
        // Note: New review might not show up immediately if it requires approval
        // Fetch to update stats if any approved
        fetchReviews()
        return true
      } else {
        toast.error(result.error || 'ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಲು ವಿಫಲವಾಗಿದೆ')
        return false
      }
    } catch (error) {
      toast.error('ದೋಷ ಸಂಭವಿಸಿದೆ')
      return false
    }
  }

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Star size={24} fill="#f59e0b" stroke="#f59e0b" />
        ಗ್ರಾಹಕರ ವಿಮರ್ಶೆಗಳು
      </h2>

      {/* Rating Summary */}
      <RatingSummary reviews={reviews} stats={stats} />

      {/* Write Review Button / Form */}
      <div style={{ marginTop: '1.5rem' }}>
        {showWriteReview ? (
          <WriteReviewForm
            bookId={bookId}
            bookTitle={bookTitle}
            onSubmit={handleSubmitReview}
            onCancel={() => setShowWriteReview(false)}
          />
        ) : (
          <button
            onClick={() => setShowWriteReview(true)}
            className="btn btn-outline"
            style={{ gap: '0.5rem' }}
          >
            <MessageSquare size={18} />
            ವಿಮರ್ಶೆ ಬರೆಯಿರಿ
          </button>
        )}
      </div>

      {/* Sort & Filter */}
      {reviews.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '2rem',
          marginBottom: '1rem'
        }}>
          <p style={{ fontWeight: 500, margin: 0 }}>
            {reviews.length} ವಿಮರ್ಶೆಗಳು
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input select"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="newest">ಹೊಸವು ಮೊದಲು</option>
            <option value="highest">ಅತಿ ಹೆಚ್ಚು ರೇಟಿಂಗ್</option>
            <option value="lowest">ಅತಿ ಕಡಿಮೆ ರೇಟಿಂಗ್</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {isLoading ? (
             <div style={{ textAlign: 'center', padding: '2rem' }}>
                <span className="spinner" />
             </div>
        ) : sortedReviews.length > 0 ? (
          sortedReviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            background: 'var(--color-bg-alt)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <AlertCircle size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }} />
            <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>ಇನ್ನೂ ವಿಮರ್ಶೆಗಳಿಲ್ಲ</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
              ಈ ಪುಸ್ತಕಕ್ಕೆ ಮೊದಲ ವಿಮರ್ಶೆ ಬರೆಯಿರಿ! (ಅನುಮೋದನೆಯ ನಂತರ ಕಾಣಿಸುತ್ತದೆ)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
