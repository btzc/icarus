const api = require('stocktwits');

const MentionService = require('./mention');
const SentimentService = require('./sentiment')
const ClientService = require('../services/client');

const Helpers = require('../helpers/helpers');

const sendMentionEventsToAll = (mentions) => {
  const clients = ClientService.getAll();
  const stockStreams = Array.from(new Set(mentions.map(({stock}) => stock)));

  stockStreams.forEach(stockStream => {
    for (const clientId in clients[stockStream]) {
      const stockMentions = mentions.filter(mention => mention.stock === stockStream);

      clients[stockStream][clientId].write(Helpers.setData(stockMentions));
    }
  })
}

const sendSentimentEventsToAll = (sentiments) => {
  const clients = ClientService.getAll();
  const stream = clients.sentiments;

  for (const clientId in stream) {
    stream[clientId].write(Helpers.setData(sentiments));
  }
}

const getTrending = () => {
  api.get('streams/trending', async function (err, res) {
    if (err) return err;

    const { messages } = res.body

    const source = 'stocktwits';
    const mentions = await MentionService.saveMentions(messages, source);
    sendMentionEventsToAll(mentions);

    const sentiments = await SentimentService.saveSentiments(mentions);
    sendSentimentEventsToAll(sentiments)
  });
};

exports.getTrending = getTrending;
