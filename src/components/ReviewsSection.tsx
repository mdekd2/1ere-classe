'use client'

import { useState } from 'react'
import { Star, ThumbsUp, MessageCircle, User } from 'lucide-react'
import { Review } from '@/lib/types'

interface ReviewsSectionProps {
  tripId: string
  reviews: Review[]
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void
}

export default function ReviewsSection({ tripId, reviews, onAddReview }: ReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onAddReview({
      tripId,
      userId: 'current-user-id', // In real app, get from auth context
      rating,
      comment: comment.trim()
    })
    
    setRating(5)
    setComment('')
    setShowReviewForm(false)
    setIsSubmitting(false)
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5: return 'Excellent'
      case 4: return 'Very Good'
      case 3: return 'Good'
      case 2: return 'Fair'
      case 1: return 'Poor'
      default: return ''
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-6 h-6 text-teal-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reviews & Ratings
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {reviews.length} reviews
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Write Review
        </button>
      </div>

      {/* Overall Rating */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {averageRating.toFixed(1)}
          </div>
          {renderStars(Math.round(averageRating), 'lg')}
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {getRatingText(Math.round(averageRating))}
          </p>
        </div>

        <div className="md:col-span-2">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm text-gray-600 dark:text-gray-300">{star}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${reviews.length > 0 ? (ratingCounts[star as keyof typeof ratingCounts] / reviews.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 w-8">
                  {ratingCounts[star as keyof typeof ratingCounts]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Write Your Review
          </h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {getRatingText(rating)}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this trip..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              No reviews yet. Be the first to review this trip!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {review.user?.name || 'Anonymous'}
                    </p>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating, 'sm')}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getRatingText(review.rating)}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {(() => {
                    try {
                      const date = review.createdAt instanceof Date ? review.createdAt : new Date(review.createdAt);
                      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
                    } catch {
                      return 'N/A';
                    }
                  })()}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.comment}
              </p>
              
              <div className="flex items-center space-x-4 mt-3">
                <button className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 