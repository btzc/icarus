const express = require('express');
const router = express.Router();

const MentionService = require('../services/mention');

const mentionsHandler = async (req, res) => {
  const { stock } = req.params;
  const { page } = req.query;

  const mentions = await MentionService.findMentions(stock, parseInt(page) - 1);

  res.send({ mentions });
};

router.get('/:stock', mentionsHandler);

module.exports = router;
