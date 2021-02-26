const api = require('stocktwits');

const MentionService = require('./mention');
const SentimentService = require('./sentiment')
const ClientService = require('../services/client');

const Helpers = require('../helpers/helpers');

const sendMentionEventsToAll = (stockStreams) => {
  const clients = ClientService.getAll();

  stockStreams.forEach(async (stockStream) => {
    for (const clientId in clients[stockStream]) {
      const recentMentions = await MentionService.findMentions(stockStream);

      clients[stockStream][clientId].write(Helpers.setData(recentMentions));
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
    const stockStreams = Array.from(new Set(mentions.map(({stock}) => stock)));
    sendMentionEventsToAll(stockStreams);

    await SentimentService.saveSentiments(mentions);
    const recentSentiments = await SentimentService.getSentiments();
    sendSentimentEventsToAll(recentSentiments)
  });
};

exports.getTrending = getTrending;
