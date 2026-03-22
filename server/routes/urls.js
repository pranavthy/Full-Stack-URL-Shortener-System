const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { originalUrl, customAlias, expiresAt, iosUrl, androidUrl } = req.body;
  try {
    let shortCode = customAlias || nanoid(6);
    
    // Check if shortCode or alias is already taken
    const existing = await Url.findOne({ shortCode });
    if (existing) return res.status(400).json({ message: 'Short code/alias already in use' });

    const url = new Url({
      originalUrl,
      shortCode,
      iosUrl,
      androidUrl,
      userId: req.user.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    await url.save();
    res.json(url);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.id, userId: req.user.id });
    if (!url) return res.status(404).json({ message: 'URL not found' });
    res.json(url);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { originalUrl } = req.body;
  try {
    const url = await Url.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { originalUrl },
      { new: true }
    );
    if (!url) return res.status(404).json({ message: 'URL not found' });
    res.json(url);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Url.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'URL deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
