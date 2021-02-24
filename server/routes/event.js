const express = require('express');
const router = express.Router();

const ClientService = require('../services/client');

const setHeaders = () => ({
  'Content-Type': 'text/event-stream',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache'
});

const eventsHandler = async (req, res) => {
  const headers = setHeaders();
  res.writeHead(200, headers);

  ClientService.handleNewClient(req, res, 'sentiments');
};

const mentionsHandler = async (req, res) => {
  const { stock } = req.params;

  const headers = setHeaders();
  res.writeHead(200, headers);

  ClientService.handleNewClient(req, res, stock);
};

router.get('/sentiments', eventsHandler);
router.get('/mentions/:stock', mentionsHandler);

module.exports = router;
