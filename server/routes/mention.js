const express = require('express');
const router = express.Router();

const MentionService = require('../services/mention');

const mentionsHandler = async (req, res) => {
  const { stock } = req.params;

  const mentions = await MentionService.findMentions(stock);

  res.send({ mentions });
};

router.get('/:stock', mentionsHandler);

module.exports = router;
