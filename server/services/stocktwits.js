const api = require('stocktwits');

const MentionService = require('./mention');
const SentimentService = require('./sentiment')
const ClientService = require('../services/client');

const setData = data => (`data: ${JSON.stringify(data)}\n\n`);

// Iterate clients list and use write res object method to send new nest
const sendEventsToAll = (sentiments) => {
  const clients = ClientService.getAll();
  for (const clientId in clients) {
    clients[clientId].write(setData(sentiments));
  }
}

const getTrending = () => {
  api.get('streams/trending', async function (err, res) {
    if (err) return err;

    const { messages } = res.body

    const source = 'stocktwits';
    const mentions = await MentionService.saveMentions(messages, source);
    const sentiments = await SentimentService.saveSentiments(mentions);

    sendEventsToAll(sentiments)
  });
};

exports.getTrending = getTrending;
