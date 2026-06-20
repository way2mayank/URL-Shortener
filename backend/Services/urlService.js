const Url = require("../models/Url");
const qrcode = require("qrcode");

const { normalizeUrl, generateShortCode, isShortCodeUnique, formatUrl, getPagination } = require("../utils/UrlHalper");

exports.shortenUrl = async (body, userId) => {
  let { originalUrl, customSlug, description, tags } = body;

  // 1. Validation 
  if (!originalUrl) {
    return { statusCode: 400, error: "Original URL is required" };
  }

  // 2. Normalize URL
  originalUrl = normalizeUrl(originalUrl);

  // 3. Validate URL format
  try {
    new URL(originalUrl);
  } catch (e) {
    return { statusCode: 400, error: "Invalid URL format" };
  }

  // 4. Check duplicate (only if no custom slug)
  if (!customSlug) {
    const existingUrl = await Url.findOne({ originalUrl, userId });

    if (existingUrl) {
      return {
        statusCode: 200,
        duplicate: true,
        data: {
          id: existingUrl._id,
          originalUrl: existingUrl.originalUrl,
          shortCode: existingUrl.shortCode,
          customSlug: existingUrl.customSlug,
          shortUrl: `http://localhost:${process.env.PORT}/${existingUrl.shortCode}`,
          qrCode: existingUrl.qrCode,
          clicks: existingUrl.clicks,
          createdAt: existingUrl.createdAt,
          message: "📌 This URL was already shortened for you",
        },
      };
    }
  }

  // 5. Short code logic
  let shortCode = customSlug;

  if (customSlug) {
    const isUnique = await isShortCodeUnique(customSlug);

    if (!isUnique) {
      return { statusCode: 400, error: "Custom slug already in use" };
    }
  } else {
    let isUnique = false;

    while (!isUnique) {
      shortCode = generateShortCode();
      isUnique = await isShortCodeUnique(shortCode);
    }
  }

  // 6. QR Code generation
  const qrCodeUrl = `http://localhost:${process.env.PORT}/${shortCode}`;
  const qrCodeDataUrl = await qrcode.toDataURL(qrCodeUrl);

  // 7. Save to DB
  const urlDoc = await Url.create({
    originalUrl,
    shortCode: shortCode.toLowerCase(),
    customSlug: customSlug ? customSlug.toLowerCase() : null,
    userId,
    qrCode: qrCodeDataUrl,
    description,
    tags: tags || [],
  });

  return {
    statusCode: 201,
    success: true,
    data: {
      id: urlDoc._id,
      originalUrl: urlDoc.originalUrl,
      shortCode: urlDoc.shortCode,
      customSlug: urlDoc.customSlug,
      shortUrl: `http://localhost:${process.env.PORT}/${urlDoc.shortCode}`,
      qrCode: urlDoc.qrCode,
      clicks: urlDoc.clicks,
      createdAt: urlDoc.createdAt,
    },
  };
};



exports.getAllUrls = async (userId, query) => {
  const { page, limit, sort } = query;

  // 1. Pagination
  const { pageNum, limitNum, skip } = getPagination(page, limit);

  // 2. Fetch URLs
  const urls = await Url.find({ userId })
    .sort(sort || "-createdAt")
    .limit(limitNum)
    .skip(skip)
    .exec();

  // 3. Total count
  const total = await Url.countDocuments({ userId });

  return {
    success: true,
    count: urls.length,
    total,
    pages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    data: urls.map(formatUrl),
  };
};



exports.getUrlById = async (id, userId) => {
  const url = await Url.findById(id);

  if (!url) {
    return {
      statusCode: 404,
      error: "URL not found",
    };
  }

  // Authorization check
  if (url.userId.toString() !== userId) {
    return {
      statusCode: 403,
      error: "Not authorized to access this URL",
    };
  }

  return {
    statusCode: 200,
    data: url,
  };
};