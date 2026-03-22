const express = require('express');
const Url = require('../models/Url');
const Click = require('../models/Click');
const router = express.Router();

router.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    // Check expiry
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({ message: 'URL has expired' });
    }

    // Record click
    const click = new Click({
      urlId: url._id,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referrer'] || req.headers['referer'],
      ip: req.ip
    });
    await click.save();

    // Increment click count
    url.clickCount += 1;
    await url.save();

    let destination = url.originalUrl;
    const ua = req.headers['user-agent'] || '';
    if (/iPad|iPhone|iPod/.test(ua) && url.iosUrl) {
      destination = url.iosUrl;
    } else if (/android/i.test(ua) && url.androidUrl) {
      destination = url.androidUrl;
    }

    res.redirect(destination);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
