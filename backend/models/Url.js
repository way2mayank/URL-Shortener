const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Please provide the original URL'],
    trim: true,
    validate: {
      validator: function(url) {
        try {
          new URL(url);
          return true;
        } catch (e) {
          return false;
        }
      },
      message: 'Please provide a valid URL'
    }
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 4,
    maxlength: 20
  },
  customSlug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'URL must belong to a user']
  },
  clicks: {
    type: Number,
    default: 0
  },
  qrCode: {
    type: String,
    default: null
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  expiresAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastClickedAt: {
    type: Date,
    default: null
  },
  lastClickedIp: {
    type: String,
    default: null
  }
});

// Index for fast lookups
urlSchema.index({ shortCode: 1 });
urlSchema.index({ userId: 1 });
urlSchema.index({ customSlug: 1 });

module.exports = mongoose.model('Url', urlSchema);
