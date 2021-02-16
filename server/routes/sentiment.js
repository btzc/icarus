const express = require('express');
const router = express.Router();

const SentimentService = require('../services/sentiment');

router.get('/all', async (req, res) => {
  const sentiments = await SentimentService.getSentiments();

  res.status(200).json({ sentiments });
});

module.exports = router;
