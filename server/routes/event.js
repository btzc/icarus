const express = require('express');
const router = express.Router();

const SentimentService = require('../services/sentiment');
const ClientService = require('../services/client');
const EventService = require('../services/event');

let sentiments = [];

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

// Iterate clients list and use write res object method to send new nest
const sendEventsToAll = (sentiment) => {
  const clients = ClientService.getAll();
  for (const clientId in clients) {
    clients[clientId].write(setData(sentiment));
  }
}
// Middleware for POST /nest endpoint
const addSentiments = async (req, res) => {
  const newSentiment = req.body
  SentimentService.saveSentiments([]);
  sentiments.push(newSentiment);

  res.json(newSentiment);

  return sendEventsToAll(newSentiment);
}

router.get('/sentiments', eventsHandler);
router.post('/sentiments', addSentiments);

module.exports = router;
