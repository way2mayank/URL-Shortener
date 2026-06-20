require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/DB');
const path = require('path');

const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urls');
const Url = require('./models/Url');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

// Server check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Root redirect route - MUST be after API routes
app.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    
    console.log(`📍 Attempting redirect for: ${shortCode}`);

    const urlDoc = await Url.findOne({ 
      $or: [
        { shortCode: shortCode.toLowerCase() },
        { customSlug: shortCode.toLowerCase() }
      ]
    });
    
    if (!urlDoc) {
      console.log(`❌ URL not found for: ${shortCode}`);
      return res.status(404).json({ error: 'Short URL not found' });
    }

    console.log(`✅ Found URL: ${urlDoc.originalUrl}, current clicks: ${urlDoc.clicks}`);
    
    // Get user IP for duplicate click detection
    const userIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Check if this IP clicked this URL in the last 2 seconds (prevent double counting)
    if (urlDoc.lastClickedIp === userIp && urlDoc.lastClickedAt) {
      const timeSinceLastClick = now - new Date(urlDoc.lastClickedAt).getTime();
      if (timeSinceLastClick < 2000) {
        console.log(`⏭️ Duplicate click detected from same IP within 2 seconds, skipping count`);
        // Don't increment, just redirect
        return res.redirect(urlDoc.originalUrl);
      }
    }
    
    // Increment click count
    urlDoc.clicks = (urlDoc.clicks || 0) + 1;
    urlDoc.lastClickedAt = new Date();
    urlDoc.lastClickedIp = userIp;
    
    await urlDoc.save();
    
    console.log(`✅ Updated clicks to: ${urlDoc.clicks}`);
    
    // Redirect to original URL
    res.redirect(urlDoc.originalUrl);
  } catch (error) {
    console.error('❌ Redirect error:', error);
    res.status(500).json({ error: 'Server error during redirect' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT : http://localhost:${PORT}`);
});
