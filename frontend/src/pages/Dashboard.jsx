import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, storesAPI, ratingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentStores, setRecentStores] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isAdmin()) {
        // Fetch admin dashboard stats
        const statsResponse = await usersAPI.getDashboardStats();
        setStats(statsResponse.data.data);
      }

      // Fetch recent stores
      const storesResponse = await storesAPI.getAll({ limit: 5, sortBy: 'created_at', sortOrder: 'DESC' });
      setRecentStores(storesResponse.data.data.stores);

      // Fetch user's recent ratings
      const ratingsResponse = await ratingsAPI.getMyRatings({ limit: 5 });
      setMyRatings(ratingsResponse.data.data.ratings);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your account.
        </p>
      </div>

      {/* Admin Stats */}
      {isAdmin() && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">U</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Users
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalUsers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Stores
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalStores}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">R</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Ratings
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalRatings}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">+</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      New Users (7 days)
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.recentActivity?.newUsers || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Stores */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Stores
            </h3>
            <div className="space-y-4">
              {recentStores.length > 0 ? (
                recentStores.map((store) => (
                  <div key={store.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {store.name}
                        </h4>
                        <p className="text-sm text-gray-500">{store.address}</p>
                        <div className="flex items-center mt-1">
                          {renderStars(Math.round(store.averageRating))}
                          <span className="ml-2 text-sm text-gray-500">
                            ({store.averageRating.toFixed(1)}) - {store.totalRatings} ratings
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No stores available</p>
              )}
            </div>
          </div>
        </div>

        {/* My Recent Ratings */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              My Recent Ratings
            </h3>
            <div className="space-y-4">
              {myRatings.length > 0 ? (
                myRatings.map((rating) => (
                  <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {rating.store?.name}
                        </h4>
                        <p className="text-sm text-gray-500">{rating.store?.address}</p>
                        <div className="flex items-center mt-1">
                          {renderStars(rating.rating)}
                          <span className="ml-2 text-sm text-gray-500">
                            Rated on {new Date(rating.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">You haven't rated any stores yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
