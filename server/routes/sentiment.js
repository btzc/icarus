const express = require('express');
const router = express.Router();

const SentimentService = require('../services/sentiment');

router.get('/all', async (req, res) => {
  const { page } = req.query || 0;
  const { documents, totalDocuments} = await SentimentService.getSentiments(parseInt(page) - 1);

  res.status(200).json({ documents, totalDocuments });
});

module.exports = router;
