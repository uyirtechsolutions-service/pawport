'use client'

import { useState, useEffect, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faQuoteRight } from '@fortawesome/free-solid-svg-icons'
import { reviewService } from '@/services/api'
import ReviewForm from './ReviewForm'

function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          className={`w-3.5 h-3.5 ${star <= rating ? 'text-pawport-orange' : 'text-pawport-orange/20'}`}
        />
      ))}
    </div>
  )
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function CustomerReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAll, setShowAll] = useState(false)

  const fetchReviews = useCallback(async () => {
    try {
      const response = await reviewService.getReviews()
      setReviews(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load reviews.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleReviewSubmitted = () => {
    fetchReviews()
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 4)
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <section id="reviews" className="py-8 md:py-10 lg:py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-pawport-orange/20 text-pawport-orange rounded-full text-[11px] font-bold uppercase tracking-widest">
            <FontAwesomeIcon icon={faStar} className="w-3 h-3" /> Customer Reviews
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-space text-black">What our customers say</h2>
          <p className="text-pawport-muted text-sm">
            Real feedback from pet parents who trusted us with their furry family.
          </p>
        </div>

        {/* Review Stats */}
        {reviews.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-pawport-orange/10">
              <span className="text-2xl font-extrabold text-pawport-orange font-space">{averageRating}</span>
              <div className="text-left">
                <StarDisplay rating={Math.round(parseFloat(averageRating))} />
                <span className="text-[10px] text-pawport-muted font-semibold uppercase tracking-wide">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Grid + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Existing Reviews */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <svg className="animate-spin h-6 w-6 text-pawport-orange" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : error ? (
              <p className="text-center text-pawport-muted text-sm py-8">{error}</p>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-2xl border border-pawport-orange/10">
                <FontAwesomeIcon icon={faQuoteRight} className="w-8 h-8 text-pawport-orange/20 mb-2" />
                <p className="text-pawport-muted text-sm">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl shadow-card border border-pawport-orange/10 p-5 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <StarDisplay rating={review.rating} />
                        <span className="text-xs text-pawport-muted ml-auto">{formatDate(review.created_at)}</span>
                      </div>
                      <p className="text-[11px] text-pawport-muted leading-relaxed mb-3 line-clamp-4">
                        "{review.comment}"
                      </p>
                      <div className="flex items-center gap-2 border-t border-pawport-orange/10 pt-2.5">
                        <div className="w-7 h-7 rounded-full bg-pawport-orange/15 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-pawport-orange uppercase">
                            {review.customer_name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-black">{review.customer_name}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {reviews.length > 4 && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-pawport-orange hover:text-pawport-orange-dark transition-colors"
                    >
                      {showAll ? 'Show less' : `View all ${reviews.length} reviews`}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Review Form */}
          <div className="lg:col-span-1">
            <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomerReviews