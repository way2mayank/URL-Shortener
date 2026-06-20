const express = require('express');
const {
  shortenUrl,
  getAllUrls,
  getUrl,
  updateUrl,
  deleteUrl,
  getAnalytics
} = require('../controllers/urlController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all URL routes
router.use(protect);

router.post('/shorten', shortenUrl);
router.get('/', getAllUrls);
router.get('/:id', getUrl);
router.put('/:id', updateUrl);
router.delete('/:id', deleteUrl);
router.get('/:id/analytics', getAnalytics);

module.exports = router;
