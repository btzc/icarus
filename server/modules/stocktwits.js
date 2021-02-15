const api = require('stocktwits');
const sentiment = require('./sentiment');

const getTrending = (callback) => {
  api.get('streams/trending', function (err, res) {
    if (err) return err;

    const { messages } = res.body;

    const analyses = messages.map(({ body, symbols } = message) => sentiment.analyzer(body, symbols[0].symbol));
    const sentimentMap = sentiment.buildSentimentMap(analyses);

    return callback(sentimentMap);
  });
};

exports.getTrending = getTrending;
