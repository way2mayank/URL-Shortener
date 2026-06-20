import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import { fetchUrls, setPage, setAutoRefresh } from '../redux/slices/urlsSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { urls, totalPages, currentPage, autoRefresh, loading } = useSelector(state => state.urls);

  // Fetch URLs on component mount or page change
  useEffect(() => {
    dispatch(fetchUrls({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      dispatch(fetchUrls({ page: currentPage, limit: 10 }));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, currentPage, dispatch]);

  const handleUrlCreated = () => {
    // Reset to page 1 when new URL is created
    dispatch(setPage(1));
    dispatch(fetchUrls({ page: 1, limit: 10 }));
  };

  const handleUrlDeleted = () => {
    // Refresh current page
    dispatch(fetchUrls({ page: currentPage, limit: 10 }));
  };

  const handlePageChange = (page) => {
    dispatch(setPage(page));
  };

  if (loading && urls.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your URLs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">📊 Dashboard</h1>
          <p className="text-slate-400 mb-6">Manage and track all your shortened URLs</p>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center space-x-2 cursor-pointer bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600 hover:border-blue-400 transition">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => dispatch(setAutoRefresh(e.target.checked))}
                className="w-4 h-4 rounded focus:outline-none"
              />
              <span className="text-sm text-slate-300">
                {autoRefresh ? '✅ Auto-refresh (5s)' : '⏸️ Auto-refresh off'}
              </span>
            </label>
            <button
              onClick={() => dispatch(fetchUrls({ page: currentPage, limit: 10 }))}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-medium rounded-lg hover:shadow-lg transition"
            >
              🔄 Refresh Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-1">
            <UrlForm onSuccess={handleUrlCreated} />
          </div>

          {/* Right Column - URL List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Shortened URLs ({urls.length})
              </h2>

              {urls.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No URLs shortened yet.</p>
                  <p className="text-gray-400 mt-2">Create one using the form on the left!</p>
                </div>
              ) : (
                <>
                  <UrlList
                    urls={urls}
                    onDelete={handleUrlDeleted}
                    onRefresh={() => dispatch(fetchUrls({ page: currentPage, limit: 10 }))}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8 pt-8 border-t flex-wrap">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>

                      <div className="flex space-x-2 flex-wrap justify-center">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                              p === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
