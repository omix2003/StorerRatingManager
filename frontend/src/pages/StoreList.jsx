import React, { useState, useEffect } from 'react';
import { storesAPI, ratingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import RatingModal from '../components/RatingModal';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [selectedStore, setSelectedStore] = useState(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storesAPI.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
      });
      setStores(response.data.data.stores);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
    setCurrentPage(1);
  };

  const handleRateStore = (store) => {
    setSelectedStore(store);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmitted = () => {
    fetchStores(); // Refresh the store list to show updated ratings
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Stores</h1>
        <p className="mt-2 text-gray-600">
          Browse and rate stores in your area.
        </p>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search stores by name or address..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 self-center">Sort by:</span>
          <button
            onClick={() => handleSort('name')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'name'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Name {sortBy === 'name' && (sortOrder === 'ASC' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('averageRating')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'averageRating'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Rating {sortBy === 'averageRating' && (sortOrder === 'ASC' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('totalRatings')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'totalRatings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Reviews {sortBy === 'totalRatings' && (sortOrder === 'ASC' ? '↑' : '↓')}
          </button>
          <button
            onClick={() => handleSort('created_at')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'created_at'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Date Added {sortBy === 'created_at' && (sortOrder === 'ASC' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {store.name}
              </h3>
              <p className="text-gray-600 mb-4">{store.address}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {renderStars(Math.round(store.averageRating))}
                  <span className="ml-2 text-sm text-gray-500">
                    ({store.averageRating.toFixed(1)})
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {store.totalRatings} ratings
                </span>
              </div>

              <button 
                onClick={() => handleRateStore(store)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Rate This Store
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded-md text-sm font-medium ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        store={selectedStore}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
};

export default StoreList;
