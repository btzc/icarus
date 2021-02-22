const express = require('express');
const router = express.Router();

const SentimentService = require('../services/sentiment');
const ClientService = require('../services/client');

const setData = data => (`data: ${JSON.stringify(data)}\n\n`);

const eventsHandler = async (req, res) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
  res.write('hello there!');

  const sentiments = await SentimentService.getSentiments();

  const data = setData(sentiments);
  res.write(data);

  ClientService.handleNewClient(req, res);
};

router.get('/sentiments', eventsHandler);

module.exports = router;
