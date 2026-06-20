import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { urlAPI } from '../../services/api';

export const fetchUrls = createAsyncThunk(
  'urls/fetchUrls',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await urlAPI.getAllUrls(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch URLs');
    }
  }
);

export const fetchSingleUrl = createAsyncThunk(
  'urls/fetchSingleUrl',
  async (id, { rejectWithValue }) => {
    try {
      const response = await urlAPI.getUrl(id);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch URL');
    }
  }
);

export const shortenUrlThunk = createAsyncThunk(
  'urls/shortenUrl',
  async (urlData, { rejectWithValue }) => {
    try {
      const response = await urlAPI.shortenUrl(
        urlData.originalUrl,
        urlData.customSlug,
        urlData.description,
        urlData.tags
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to shorten URL');
    }
  }
);

export const deleteUrlThunk = createAsyncThunk(
  'urls/deleteUrl',
  async (id, { rejectWithValue }) => {
    try {
      await urlAPI.deleteUrl(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete URL');
    }
  }
);

export const updateUrlThunk = createAsyncThunk(
  'urls/updateUrl',
  async ({ id, description, tags }, { rejectWithValue }) => {
    try {
      const response = await urlAPI.updateUrl(id, description, tags);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update URL');
    }
  }
);

export const fetchAnalytics = createAsyncThunk(
  'urls/fetchAnalytics',
  async (id, { rejectWithValue }) => {
    try {
      const response = await urlAPI.getAnalytics(id);
      return { id, analytics: response.data.analytics };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch analytics');
    }
  }
);

const initialState = {
  urls: [],
  singleUrl: null,
  totalUrls: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 10,
  loading: false,
  error: null,
  analytics: {},
  autoRefresh: true,
};

const urlsSlice = createSlice({
  name: 'urls',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSingleUrl: (state) => {
      state.singleUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch URLs
      .addCase(fetchUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = Array.isArray(action.payload.data) ? action.payload.data : [];
        state.totalUrls = action.payload.total || 0;
        state.totalPages = action.payload.pages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.urls = [];
        state.totalPages = 1;
        state.currentPage = 1;
      })
      // Fetch Single URL
      .addCase(fetchSingleUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUrl = action.payload;
      })
      .addCase(fetchSingleUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Shorten URL
      .addCase(shortenUrlThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(shortenUrlThunk.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh URLs after creating new one
        state.currentPage = 1;
      })
      .addCase(shortenUrlThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete URL
      .addCase(deleteUrlThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUrlThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = state.urls.filter(url => url.id !== action.payload);
        state.totalUrls -= 1;
      })
      .addCase(deleteUrlThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update URL
      .addCase(updateUrlThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUrlThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.urls.findIndex(url => url.id === action.payload.id);
        if (index !== -1) {
          state.urls[index] = action.payload;
        }
      })
      .addCase(updateUrlThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Analytics
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics[action.payload.id] = action.payload.analytics;
      });
  },
});

export const { setPage, setAutoRefresh, clearError, clearSingleUrl } = urlsSlice.actions;
export default urlsSlice.reducer;
