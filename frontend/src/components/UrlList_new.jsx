import React, { useState } from 'react';
import { toast } from 'react-toastify';
import QRCodeComponent from 'react-qr-code';
import { urlAPI } from '../services/api';

const UrlList = ({ urls, onDelete, onRefresh }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', tags: '' });

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;

    try {
      await urlAPI.deleteUrl(id);
      toast.success('URL deleted successfully');
      onDelete();
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const handleViewAnalytics = async (id) => {
    setLoadingAnalytics(true);
    try {
      const response = await urlAPI.getAnalytics(id);
      setAnalytics(response.data.analytics);
      setExpandedId(id);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleCopyUrl = (shortCode) => {
    const baseUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '') || 'http://localhost:5000';
    const url = `${baseUrl}/${shortCode}`;
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const handleEditClick = (url) => {
    setEditingId(url.id);
    setEditForm({
      description: url.description || '',
      tags: url.tags ? url.tags.join(', ') : ''
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      const tags = editForm.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await urlAPI.updateUrl(id, editForm.description, tags);
      toast.success('URL updated successfully!');
      setEditingId(null);
      onRefresh();
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
      <div className="text-center py-16">
        <p className="text-5xl mb-4">📭</p>
        <p className="text-slate-300 text-lg font-medium">No URLs shortened yet.</p>
        <p className="text-slate-400 text-sm mt-2">Create one using the form on the left!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {urls.map(url => (
        <div key={url.id} className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-600 hover:border-blue-400 transition">
          <div className="p-6">
            {/* Main Info Row */}
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div className="flex-1 min-w-fit">
                <p className="text-xs text-slate-400 mb-1">🌐 Original URL</p>
                <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-mono text-sm break-all line-clamp-2">
                  {url.originalUrl}
                </a>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">👁️ Clicks</p>
                <p className="text-3xl font-bold text-white">{url.clicks}</p>
              </div>
            </div>

            {/* Short URL Section */}
            <div className="bg-slate-600/50 rounded-xl p-4 mb-4 border border-slate-500">
              <p className="text-xs text-slate-400 mb-2">🔗 Short URL</p>
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-green-400 font-mono font-bold text-sm">
                  {`${(process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '') || 'http://localhost:5000'}/${url.shortCode}`}
                </code>
                <button
                  onClick={() => handleCopyUrl(url.shortCode)}
                  className="px-3 py-1 bg-blue-600/80 hover:bg-blue-500 text-white text-xs font-medium rounded transition"
                >
                  📋 Copy
                </button>
              </div>
            </div>

            {/* Description & QR Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                {url.description && (
                  <>
                    <p className="text-xs text-slate-400 mb-1">📝 Description</p>
                    <p className="text-slate-300 text-sm bg-slate-600/50 p-2 rounded">{url.description}</p>
                  </>
                )}
                {url.tags && url.tags.length > 0 && (
                  <>
                    <p className="text-xs text-slate-400 mb-1 mt-3">🏷️ Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {url.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-600/50 text-blue-300 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col items-center justify-center bg-slate-600/50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-2">QR Code</p>
                {url.qrCode ? (
                  <>
                    <img src={url.qrCode} alt="QR Code" className="w-32 h-32 rounded" />
                    <button
                      onClick={() => handleDownloadQR(url.qrCode, url.shortCode)}
                      className="mt-2 text-xs text-blue-400 hover:text-blue-300 font-medium"
                    >
                      ⬇️ Download
                    </button>
                  </>
                ) : (
                  <QRCodeComponent value={`${(process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '') || 'http://localhost:5000'}/${url.shortCode}`} size={120} level="H" />
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 py-4 border-y border-slate-600">
              <div>
                <p className="text-xs text-slate-400">📅 Created</p>
                <p className="text-sm font-medium text-white">{new Date(url.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">⏱️ Last Click</p>
                <p className="text-sm font-medium text-white">
                  {url.lastClickedAt ? new Date(url.lastClickedAt).toLocaleDateString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400">📊 Analytics</p>
                <button
                  onClick={() => handleViewAnalytics(url.id)}
                  disabled={loadingAnalytics}
                  className="text-sm font-medium text-blue-400 hover:text-blue-300 disabled:opacity-50"
                >
                  {loadingAnalytics ? '⏳ Loading...' : 'View'}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEditClick(url)}
                className="flex-1 px-4 py-2 bg-blue-600/80 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(url.id)}
                className="flex-1 px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition"
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Edit Mode */}
          {editingId === url.id && (
            <div className="bg-slate-600/50 border-t border-slate-600 p-6">
              <h4 className="font-bold text-white mb-4">✏️ Edit URL</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="Update description"
                    rows="2"
                    className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-2">Tags</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(url.id)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm font-medium transition"
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UrlList;
