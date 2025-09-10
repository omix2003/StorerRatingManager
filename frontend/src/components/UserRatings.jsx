import React, { useState, useEffect } from 'react';
import { ratingsAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import RatingModal from './RatingModal';

const UserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchUserRatings();
  }, []);

  const fetchUserRatings = async () => {
    try {
      setLoading(true);
      const response = await ratingsAPI.getMyRatings();
      setRatings(response.data.data.ratings);
    } catch (error) {
      console.error('Error fetching user ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRating = (rating) => {
    setSelectedRating(rating);
    setIsEditModalOpen(true);
  };

  const handleRatingUpdated = () => {
    fetchUserRatings(); // Refresh the ratings list
  };

  const handleCloseEditModal = () => {
    setSelectedRating(null);
    setIsEditModalOpen(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
        <p className="mt-2 text-gray-600">
          View and edit your store ratings and reviews.
        </p>
      </div>

      {ratings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">⭐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings yet</h3>
          <p className="text-gray-500">You haven't rated any stores yet. Start by browsing stores and sharing your experience!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {ratings.map((rating) => (
            <div key={rating.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {rating.store?.name}
                  </h3>
                  <p className="text-sm text-gray-500">{rating.store?.address}</p>
                </div>
                <button
                  onClick={() => handleEditRating(rating)}
                  className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
              </div>

              <div className="flex items-center mb-3">
                {renderStars(rating.rating)}
                <span className="ml-2 text-sm text-gray-500">
                  Rated on {new Date(rating.created_at).toLocaleDateString()}
                </span>
              </div>

              {rating.reviewText && (
                <div className="bg-gray-50 rounded-md p-4">
                  <p className="text-gray-700 italic">"{rating.reviewText}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Rating Modal */}
      <RatingModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        store={selectedRating?.store}
        existingRating={selectedRating}
        onRatingSubmitted={handleRatingUpdated}
      />
    </div>
  );
};

export default UserRatings;
