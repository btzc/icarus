const express = require('express');
const router = express.Router();

const SentimentService = require('../services/sentiment');
const ClientService = require('../services/client');

const Helpers = require('../helpers/helpers');

let sentiments = [];

async function eventsHandler(req, res) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
  res.write('hello there!');

  const sentiments = await SentimentService.getSentiments();

  const data = `data: ${JSON.stringify(sentiments[0])}\n\n`;
  res.write(data);

  const clientId = await Helpers.generateClientUUID();
  const client = {
    id: clientId,
    res: res
  };

  ClientService.set(client);

  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    ClientService.remove(clientId);
  });
}
// Iterate clients list and use write res object method to send new nest
function sendEventsToAll(newSentiment) {
  const clients = ClientService.getAll();
  for (const clientId in clients) {
    clients[clientId].write(`data: ${JSON.stringify(newSentiment)}\n\n`);
  }
}
// Middleware for POST /nest endpoint
async function addSentiments(req, res) {
  const newSentiment = req.body
  SentimentService.saveSentiments([]);
  sentiments.push(newSentiment);

  res.json(newSentiment);

  return sendEventsToAll(newSentiment);
}

router.get('/sentiments', eventsHandler);
router.post('/sentiments', addSentiments);

module.exports = router;
