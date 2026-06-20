import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import QRCodeComponent from 'react-qr-code';
import { deleteUrlThunk, updateUrlThunk, fetchSingleUrl, fetchAnalytics } from '../redux/slices/urlsSlice';

const UrlList = ({ urls, onDelete, onRefresh }) => {
  const dispatch = useDispatch();
  const { analytics } = useSelector(state => state.urls);
  const [expandedId, setExpandedId] = useState(null);
  const [currentAnalytics, setCurrentAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', tags: '' });
  const [detailsId, setDetailsId] = useState(null);
  const [urlDetails, setUrlDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;

    try {
      const result = await dispatch(deleteUrlThunk(id));
      if (result.type === deleteUrlThunk.fulfilled.type) {
        toast.success('URL deleted successfully');
        onDelete();
      } else {
        toast.error('Failed to delete URL');
      }
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const handleViewAnalytics = async (id) => {
    // Toggle - if already open, close it
    if (expandedId === id) {
      setExpandedId(null);
      setCurrentAnalytics(null);
      return;
    }

    setLoadingAnalytics(true);
    try {
      const result = await dispatch(fetchAnalytics(id));
      if (result.type === fetchAnalytics.fulfilled.type) {
        setCurrentAnalytics(analytics[id]);
        setExpandedId(id);
        setDetailsId(null); // Close details if open
        setEditingId(null); // Close edit if open
      } else {
        toast.error('Failed to load analytics');
      }
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleViewDetails = async (id) => {
    // Toggle - if already open, close it
    if (detailsId === id) {
      setDetailsId(null);
      setUrlDetails(null);
      return;
    }

    setLoadingDetails(true);
    try {
      const result = await dispatch(fetchSingleUrl(id));
      if (result.type === fetchSingleUrl.fulfilled.type) {
        setUrlDetails(result.payload);
        setDetailsId(id);
        setExpandedId(null); // Close analytics if open
        setEditingId(null); // Close edit if open
      } else {
        toast.error('Failed to load URL details');
      }
    } catch (error) {
      toast.error('Failed to load URL details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCopyUrl = (shortCode) => {
    // Remove /api from the base URL to get server URL
    const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '') || 'http://localhost:5000';
    const url = `${baseUrl}/${shortCode}`;
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const handleEditClick = (url) => {
    // Toggle - if already open, close it
    if (editingId === url.id) {
      setEditingId(null);
      setEditForm({ description: '', tags: '' });
      return;
    }

    setEditingId(url.id);
    setEditForm({
      description: url.description || '',
      tags: url.tags ? url.tags.join(', ') : ''
    });
    setExpandedId(null); // Close analytics if open
    setDetailsId(null); // Close details if open
  };

  const handleSaveEdit = async (id) => {
    try {
      const tags = editForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const result = await dispatch(updateUrlThunk({
        id,
        description: editForm.description,
        tags
      }));

      if (result.type === updateUrlThunk.fulfilled.type) {
        toast.success('URL updated successfully!');
        setEditingId(null);
        onRefresh();
      } else {
        toast.error('Failed to update URL');
      }
    } catch (error) {
      toast.error('Failed to update URL');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ description: '', tags: '' });
  };

  const handleDownloadQR = (qrCode, shortCode) => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${shortCode}.png`;
    link.click();
  };

  if (!urls || urls.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No URLs shortened yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {urls.map(url => (
        <div key={url.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Original URL</p>
                <p className="text-blue-600 font-mono text-sm break-all hover:underline cursor-pointer"
                   onClick={() => window.open(url.originalUrl, '_blank')}>
                  {url.originalUrl}
                </p>

                <p className="text-sm text-gray-500 mb-1 mt-4">Short URL</p>
                <div className="flex items-center space-x-2">
                  <p className="text-green-600 font-mono font-bold text-sm">
                    {`${(process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '') || 'http://localhost:5000'}/${url.shortCode}`}
                  </p>
                  <button
                    onClick={() => handleCopyUrl(url.shortCode)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    📋 Copy
                  </button>
                </div>

                {url.description && (
                  <>
                    <p className="text-sm text-gray-500 mb-1 mt-4">Description</p>
                    <p className="text-gray-700 text-sm">{url.description}</p>
                  </>
                )}
              </div>

              <div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-2">QR Code</p>
                  {url.qrCode ? (
                    <div className="flex justify-center mb-3">
                      <img src={url.qrCode} alt="QR Code" style={{width: 150, height: 150}} />
                    </div>
                  ) : (
                    <div className="flex justify-center mb-3">
                      <QRCodeComponent value={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '') || 'http://localhost:5000'}/${url.shortCode}`} size={150} level="H" />
                    </div>
                  )}
                  {url.qrCode && (
                    <button
                      onClick={() => handleDownloadQR(url.qrCode, url.shortCode)}
                      className="w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      ⬇️ Download QR
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div>
                <p className="text-sm text-gray-500">Clicks</p>
                <p className="text-2xl font-bold text-gray-800">{url.clicks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-800">
                  {new Date(url.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Clicked</p>
                <p className="text-sm font-medium text-gray-800">
                  {url.lastClickedAt ? new Date(url.lastClickedAt).toLocaleDateString() : 'Never'}
                </p>
              </div>
              <div className="flex items-end space-x-2">
                <button
                  onClick={() => handleViewAnalytics(url.id)}
                  disabled={loadingAnalytics}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    expandedId === url.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {loadingAnalytics ? '⏳ Loading...' : '📊 Analytics'}
                </button>
                <button
                  onClick={() => handleViewDetails(url.id)}
                  disabled={loadingDetails}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${
                    detailsId === url.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  }`}
                >
                  {loadingDetails ? '⏳ Loading...' : '🔍 Details'}
                </button>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleEditClick(url)}
                className={`px-4 py-2 rounded-lg hover:bg-blue-200 text-sm font-medium transition ${
                  editingId === url.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(url.id)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium transition"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {editingId === url.id && (
            <div className="bg-blue-50 border-t border-blue-200 p-6">
              <h4 className="font-bold text-gray-800 mb-4">✏️ Edit URL</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Update description"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSaveEdit(url.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium transition"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {expandedId === url.id && currentAnalytics && (
            <div className="bg-blue-50 border-t border-blue-200 p-6">
              <h4 className="font-bold text-gray-800 mb-4">📈 Analytics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-800">{currentAnalytics.clicks}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-sm font-medium text-gray-800">
                    {new Date(currentAnalytics.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Days Active</p>
                  <p className="text-2xl font-bold text-gray-800">{currentAnalytics.daysSinceCreation || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Clicks/Day</p>
                  <p className="text-2xl font-bold text-gray-800">{currentAnalytics.clicksPerDay || 0}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setExpandedId(null);
                  setCurrentAnalytics(null);
                }}
                className="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium transition"
              >
                ✕ Close Analytics
              </button>
            </div>
          )}

          {detailsId === url.id && urlDetails && (
            <div className="bg-purple-50 border-t border-purple-200 p-6">
              <h4 className="font-bold text-gray-800 mb-4">🔍 URL Details</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Original URL</p>
                    <p className="text-sm font-mono break-all text-gray-800 mt-2">{urlDetails.originalUrl}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Short Code</p>
                    <p className="text-sm font-mono font-bold text-green-600 mt-2">{urlDetails.shortCode}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Custom Slug</p>
                    <p className="text-sm font-mono text-gray-800 mt-2">{urlDetails.customSlug || 'None'}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Clicks</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{urlDetails.clicks}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-sm font-medium text-gray-800 mt-2">{new Date(urlDetails.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Last Clicked</p>
                    <p className="text-sm font-medium text-gray-800 mt-2">{urlDetails.lastClickedAt ? new Date(urlDetails.lastClickedAt).toLocaleString() : 'Never'}</p>
                  </div>
                </div>
                {urlDetails.description && (
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-sm text-gray-800 mt-2">{urlDetails.description}</p>
                  </div>
                )}
                {urlDetails.tags && urlDetails.tags.length > 0 && (
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {urlDetails.tags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => {
                    setDetailsId(null);
                    setUrlDetails(null);
                  }}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm font-medium transition"
                >
                  ✕ Close Details
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UrlList;
