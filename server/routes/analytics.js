const express = require('express');
const Click = require('../models/Click');
const Url = require('../models/Url');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/:urlId', auth, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.urlId, userId: req.user.id });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    const totalClicks = url.clickCount;
    const clicks = await Click.find({ urlId: url._id }).sort({ timestamp: -1 }).limit(20);
    const lastVisit = clicks.length > 0 ? clicks[0].timestamp : null;

    res.json({
      totalClicks,
      lastVisit,
      recentHistory: clicks
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:urlId/daily', auth, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.urlId, userId: req.user.id });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    // Aggregate daily clicks for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const stats = await Click.aggregate([
      { $match: { urlId: url._id, timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
