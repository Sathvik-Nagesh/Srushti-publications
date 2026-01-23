'use client'

import { useState, useEffect } from 'react'
import { Star, Check, X, Trash2, User, Search, RefreshCcw } from 'lucide-react'
import toast from 'react-hot-toast'

interface Review {
  id: string
  rating: number
  title?: string
  comment: string
  authorName: string
  authorEmail: string
  isVerified: boolean
  isApproved: boolean
  bookId: string
  createdAt: string
  book?: { id: string; title: string; slug: string }
}

interface ReviewSummary {
  pending: number
  approved: number
  total: number
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<ReviewSummary>({ pending: 0, approved: 0, total: 0 })
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/reviews?filter=${filter}`)
      const data = await response.json()
      
      if (data.success) {
        setReviews(data.data)
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      toast.error('ವಿಮರ್ಶೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲ')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [filter])

  const handleAction = async (reviewId: string, action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete' && !confirm('ಈ ವಿಮರ್ಶೆಯನ್ನು ಅಳಿಸಬೇಕೇ?')) return
    
    setIsProcessing(reviewId)
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        fetchReviews()
      } else {
        toast.error(data.error || 'ಕಾರ್ಯಾಚರಣೆ ವಿಫಲ')
      }
    } catch (error) {
      toast.error('ಕಾರ್ಯಾಚರಣೆ ವಿಫಲ')
    } finally {
      setIsProcessing(null)
    }
  }

  const renderStars = (rating: number) => (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={16}
          fill={star <= rating ? '#fbbf24' : 'transparent'}
          stroke={star <= rating ? '#fbbf24' : '#d1d5db'}
        />
      ))}
    </div>
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('kn-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            ⭐ ವಿಮರ್ಶೆಗಳ ನಿರ್ವಹಣೆ
          </h1>
          <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
            ಗ್ರಾಹಕರ ವಿಮರ್ಶೆಗಳನ್ನು ಅನುಮೋದಿಸಿ ಅಥವಾ ತಿರಸ್ಕರಿಸಿ
          </p>
        </div>
        
        <button
          onClick={fetchReviews}
          className="btn btn-outline"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCcw size={18} />
          ರಿಫ್ರೆಶ್
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div
          onClick={() => setFilter('pending')}
          style={{
            background: filter === 'pending' ? '#fbbf2420' : 'white',
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            border: filter === 'pending' ? '2px solid #fbbf24' : '1px solid var(--color-border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b' }}>
            {summary.pending}
          </div>
          <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
            ಬಾಕಿ ಇದೆ
          </div>
        </div>
        
        <div
          onClick={() => setFilter('approved')}
          style={{
            background: filter === 'approved' ? '#10b98120' : 'white',
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            border: filter === 'approved' ? '2px solid #10b981' : '1px solid var(--color-border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981' }}>
            {summary.approved}
          </div>
          <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
            ಅನುಮೋದಿತ
          </div>
        </div>
        
        <div
          onClick={() => setFilter('all')}
          style={{
            background: filter === 'all' ? 'var(--color-primary)10' : 'white',
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            border: filter === 'all' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {summary.total}
          </div>
          <div style={{ color: 'var(--color-text-light)', fontSize: '0.875rem' }}>
            ಒಟ್ಟು
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="spinner" style={{ width: 40, height: 40 }} />
        </div>
      ) : reviews.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--color-bg-alt)',
          borderRadius: 'var(--radius-xl)'
        }}>
          <Star size={48} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 500 }}>
            {filter === 'pending' ? 'ಬಾಕಿ ಇರುವ ವಿಮರ್ಶೆಗಳಿಲ್ಲ' : 'ವಿಮರ್ಶೆಗಳಿಲ್ಲ'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.map(review => (
            <div
              key={review.id}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                border: '1px solid var(--color-border)',
                opacity: isProcessing === review.id ? 0.5 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      width: 40,
                      height: 40,
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
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {review.authorName}
                        {review.isVerified && (
                          <span style={{
                            background: '#10b98120',
                            color: '#10b981',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.6875rem',
                            fontWeight: 600
                          }}>
                            ✓ ಪರಿಶೀಲಿತ
                          </span>
                        )}
                        <span style={{
                          background: review.isApproved ? '#10b98120' : '#fbbf2420',
                          color: review.isApproved ? '#10b981' : '#f59e0b',
                          padding: '0.125rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.6875rem',
                          fontWeight: 600
                        }}>
                          {review.isApproved ? 'ಅನುಮೋದಿತ' : 'ಬಾಕಿ'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {review.authorEmail}
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating & Book */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    {renderStars(review.rating)}
                    {review.book && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-light)',
                        background: 'var(--color-cream-light)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-md)'
                      }}>
                        📚 {review.book.title}
                      </span>
                    )}
                  </div>
                  
                  {/* Title & Comment */}
                  {review.title && (
                    <h4 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{review.title}</h4>
                  )}
                  <p style={{ color: 'var(--color-text-light)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {review.comment}
                  </p>
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                    {formatDate(review.createdAt)}
                  </div>
                </div>
                
                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!review.isApproved && (
                    <button
                      onClick={() => handleAction(review.id, 'approve')}
                      disabled={isProcessing === review.id}
                      className="btn"
                      style={{
                        background: '#10b981',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <Check size={16} />
                      ಅನುಮೋದಿಸಿ
                    </button>
                  )}
                  {review.isApproved && (
                    <button
                      onClick={() => handleAction(review.id, 'reject')}
                      disabled={isProcessing === review.id}
                      className="btn btn-outline"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <X size={16} />
                      ತಿರಸ್ಕರಿಸಿ
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(review.id, 'delete')}
                    disabled={isProcessing === review.id}
                    className="btn"
                    style={{
                      background: 'var(--color-error)',
                      color: 'white',
                      padding: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
