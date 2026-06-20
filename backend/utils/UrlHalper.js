const Url = require("../models/Url");

// Normalize URL for comparison
const normalizeUrl = (url) => {
  try {
    const urlObj = new URL(url);

    return urlObj.toString().toLowerCase().replace(/\/$/, "");
  } catch (e) {
    return url;
  }
};

// Generate random short code
const generateShortCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Check if short code is unique
const isShortCodeUnique = async (code) => {
  const existing = await Url.findOne({
    $or: [{ shortCode: code }, { customSlug: code }],
  });
  return !existing;
};

// build pagination skip value
const getPagination = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;

  const skip = (pageNum - 1) * limitNum;

  return { pageNum, limitNum, skip };
};

// format URL response
const formatUrl = (url) => ({
  id: url._id,
  originalUrl: url.originalUrl,
  shortCode: url.shortCode,
  customSlug: url.customSlug,
  clicks: url.clicks,
  description: url.description,
  tags: url.tags,
  qrCode: url.qrCode,
  updatedAt : url.updatedAt,
  createdAt: url.createdAt,
  lastClickedAt: url.lastClickedAt,
});



module.exports = {
  normalizeUrl,
  generateShortCode,
  isShortCodeUnique,
  getPagination,
  formatUrl,
};
