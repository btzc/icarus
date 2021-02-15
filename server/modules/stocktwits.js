const api = require('stocktwits');

const sentiment = require('./sentiment')
const mention = require('./mention');

const getTrending = () => {
  api.get('streams/trending', async function (err, res) {
    if (err) return err;

    const { messages } = res.body

    const source = 'stocktwits';
    const mentions = await mention.saveMentions(messages, source);

    sentiment.saveSentiments(mentions);
  });
};

exports.getTrending = getTrending;
