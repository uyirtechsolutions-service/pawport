'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { reviewService } from '@/services/api'

function ReviewForm({ onReviewSubmitted }) {
  const [customerName, setCustomerName] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!customerName.trim()) {
      setError('Please enter your name.')
      return
    }
    if (rating === 0) {
      setError('Please select a star rating.')
      return
    }
    if (!comment.trim()) {
      setError('Please enter a comment.')
      return
    }

    setSubmitting(true)
    try {
      await reviewService.submitReview({
        customer_name: customerName.trim(),
        rating,
        comment: comment.trim()
      })
      setSuccess(true)
      setCustomerName('')
      setRating(0)
      setComment('')
      if (onReviewSubmitted) onReviewSubmitted()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-card border border-pawport-orange/10 p-6 md:p-8">
      <h3 className="font-space font-bold text-black text-lg md:text-xl mb-1">Share your experience</h3>
      <p className="text-pawport-muted text-xs mb-5">Rate your journey with Pawport Transport</p>

      {success ? (
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-black font-bold text-sm">Thank you for your review!</p>
          <p className="text-pawport-muted text-xs mt-1">Your feedback helps us improve.</p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-4 text-pawport-orange font-bold text-xs hover:underline"
          >
            Write another review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label htmlFor="review-name" className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wide">
              Your Name
            </label>
            <input
              id="review-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 text-sm text-black bg-pawport-orange/[0.04] border border-pawport-orange/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-pawport-orange/40 focus:border-pawport-orange placeholder:text-pawport-muted/50 transition-all duration-200"
              maxLength={255}
            />
          </div>

          {/* Star Rating */}
          <div>
            <span className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wide">
              Rating
            </span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-2xl transition-all duration-150 hover:scale-110 focus:outline-none"
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <FontAwesomeIcon
                    icon={faStar}
                    className={((hoverRating || rating) >= star) ? 'text-pawport-orange drop-shadow-sm' : 'text-pawport-orange/20'}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-sm font-bold text-pawport-orange">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="review-comment" className="block text-xs font-bold text-black mb-1.5 uppercase tracking-wide">
              Your Comment
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with Pawport Transport..."
              rows={4}
              className="w-full px-4 py-2.5 text-sm text-black bg-pawport-orange/[0.04] border border-pawport-orange/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-pawport-orange/40 focus:border-pawport-orange placeholder:text-pawport-muted/50 transition-all duration-200 resize-none"
              maxLength={1000}
            />
            <p className="text-[10px] text-pawport-muted mt-1 text-right">{comment.length}/1000</p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-xs font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pawport-orange to-pawport-orange-dark text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
      )}
    </div>
  )
}

export default ReviewForm