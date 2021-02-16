const express = require('express');
const router = express.Router();

const SentimentService = require('../services/sentiment');

// cache
  // getCache
  // getClients
  // setClients
  // deleteClients


let clients = [];
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

  const data = `data: ${JSON.stringify(sentiments)}\n\n`;
  res.write(data);

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  console.log(clients.length);

  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(c => c.id !== clientId);
  });
}
// Iterate clients list and use write res object method to send new nest
function sendEventsToAll(newSentiment) {
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(newSentiment)}\n\n`));
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
