import React, { useState } from 'react';
import { ratingsAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const RatingModal = ({ isOpen, onClose, store, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await ratingsAPI.create({
        storeId: store.id,
        rating: rating,
      });
      onRatingSubmitted();
      onClose();
      setRating(0);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit rating';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Rate {store?.name}
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
              {loading ? <LoadingSpinner size="small" /> : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
