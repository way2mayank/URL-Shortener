const Url = require("../models/Url");
const urlService = require("../services/urlService");
const { formatUrl } = require("../utils/UrlHalper");

exports.shortenUrl = async (req, res) => {
  try {
    const result = await urlService.shortenUrl(
      req.body,
      req.user.id
    );

    return res.status(result.statusCode).json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error while shortening URL" });
  }
};


exports.getAllUrls = async (req, res) => {
  try {
    const result = await urlService.getAllUrls(
      req.user.id,
      req.query
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error fetching URLs",
    });
  }
};


exports.getUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await urlService.getUrlById(id, userId);

    if (result.error) {
      return res.status(result.statusCode).json({
        error: result.error,
      });
    } 

    return res.status(200).json({
      success: true,
      data: formatUrl(result.data),
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error fetching URL",
    });
  }
};

exports.updateUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { description, tags } = req.body;

    let url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Check authorization
    if (url.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this URL" });
    }

    // Update fields
    if (description) url.description = description;
    if (tags) url.tags = tags;
    url.updatedAt = new Date();

    url = await url.save();

    res.status(200).json({
      success: true,
      data: {
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        description: url.description,
        tags: url.tags,
        clicks: url.clicks,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error updating URL" });
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Check authorization
    if (url.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this URL" });
    }

    await Url.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Server error deleting URL" });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // Check authorization
    if (url.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to access this URL" });
    }

    res.status(200).json({
      success: true,
      analytics: {
        urlId: url._id,
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        clicks: url.clicks,
        createdAt: url.createdAt,
        lastClickedAt: url.lastClickedAt,
        daysSinceCreation: Math.floor(
          (new Date() - url.createdAt) / (1000 * 60 * 60 * 24),
        ),
        clicksPerDay:
          url.clicks > 0
            ? (
                url.clicks /
                (Math.floor(
                  (new Date() - url.createdAt) / (1000 * 60 * 60 * 24),
                ) +
                  1)
              ).toFixed(2)
            : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error fetching analytics" });
  }
};
