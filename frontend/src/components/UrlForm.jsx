import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { shortenUrlThunk } from '../redux/slices/urlsSlice';

const UrlForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customSlug: '',
    description: '',
    tags: ''
  });
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.urls);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const result = await dispatch(shortenUrlThunk({
        originalUrl: formData.originalUrl,
        customSlug: formData.customSlug || undefined,
        description: formData.description || undefined,
        tags
      }));

      if (result.type === shortenUrlThunk.fulfilled.type) {
        if (result.payload.duplicate) {
          toast.info('📌 This URL was already shortened for you');
        } else {
          toast.success('URL shortened successfully!');
        }
        
        setFormData({ originalUrl: '', customSlug: '', description: '', tags: '' });
        onSuccess(result.payload.data);
      } else {
        toast.error(result.payload || 'Failed to shorten URL');
      }
    } catch (error) {
      toast.error('Failed to shorten URL');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-xl p-8 border border-slate-600">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">✂️ Create Short URL</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            🌐 Original URL *
          </label>
          <input
            type="url"
            name="originalUrl"
            value={formData.originalUrl}
            onChange={handleChange}
            placeholder="https://example.com/very/long/url"
            required
            className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            🎯 Custom Slug (Optional)
          </label>
          <input
            type="text"
            name="customSlug"
            value={formData.customSlug}
            onChange={handleChange}
            placeholder="myurl"
            className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-slate-400 mt-1">Leave empty for auto-generated</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            📝 Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add a description for this link"
            rows="2"
            className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            🏷️ Tags (Optional)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="work, marketing, personal"
            className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-slate-400 mt-1">Separate with commas</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Shortening...' : '✂️ Shorten URL'}
        </button>
      </form>
    </div>
  );
};

export default UrlForm;
