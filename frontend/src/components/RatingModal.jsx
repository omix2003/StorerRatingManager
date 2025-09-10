import React, { useState, useEffect } from 'react';
import { ratingsAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const RatingModal = ({ isOpen, onClose, store, onRatingSubmitted, existingRating = null }) => {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [reviewText, setReviewText] = useState(existingRating?.reviewText || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update state when existingRating changes
  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating || 0);
      setReviewText(existingRating.reviewText || '');
    } else {
      setRating(0);
      setReviewText('');
    }
  }, [existingRating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (existingRating) {
        // Update existing rating
        await ratingsAPI.update(existingRating.id, {
          rating: rating,
          reviewText: reviewText.trim() || null,
        });
      } else {
        // Create new rating
        await ratingsAPI.create({
          storeId: store.id,
          rating: rating,
          reviewText: reviewText.trim() || null,
        });
      }
      
      onRatingSubmitted();
      onClose();
      setRating(0);
      setReviewText('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit rating';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(existingRating?.rating || 0);
    setReviewText(existingRating?.reviewText || '');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {existingRating ? 'Edit Your Rating' : 'Rate'} {store?.name}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {rating === 0 ? 'Select a rating' : 
               rating === 1 ? 'Poor' :
               rating === 2 ? 'Fair' :
               rating === 3 ? 'Good' :
               rating === 4 ? 'Very Good' : 'Excellent'}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review (Optional)
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Share your experience with this store..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {reviewText.length}/1000 characters
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <LoadingSpinner size="small" /> : (existingRating ? 'Update Rating' : 'Submit Rating')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
