const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const stopWords = require('stopword');

const Sentiment = require('../models/sentiment.model').Sentiment;

const saveAndUpdateSentiment = async (stock, sentiment) => {
  const sentimentRecord = await Sentiment.findOne({ stock: stock });

  if (!sentimentRecord) {
    return await new Sentiment({stock, sentiment}).save();
  }

  sentimentRecord.sentiment += sentiment;

  return await sentimentRecord.save();
}

const saveAndUpdateSentiments = async (sentimentMap) => {
  const sentiments = [];
  for (const [stock, sentiment] of Object.entries(sentimentMap)) {
    const savedSentiment = await saveAndUpdateSentiment(stock, sentiment);
    sentiments.push(savedSentiment);
  };

  return sentiments;
};

const buildAnalysis = (sentiment, symbol) => {
  let result = 0;

  if (sentiment > 0) {
    result = 1;
  } else if (sentiment < 0) {
    result = -1;
  } else {
    result = 0;
  }

  return {
    sentiment: result,
    symbol: symbol
  };
}

const analyzer = (text, symbol) => {
  const lexedReview = aposToLexForm(text);
  const casedReview = lexedReview.toLowerCase();
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

  const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
  const filteredReview = stopWords.removeStopwords(tokenizedReview);

  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
  const sentiment = analyzer.getSentiment(filteredReview);

  const analysis = buildAnalysis(sentiment, symbol);
  return analysis;
}

const buildSentimentMap = (analyses) => {
  const sentimentMap = {};

  analyses.forEach(({sentiment, symbol} = analysis) => {
    if (sentimentMap[symbol]) {
      sentimentMap[symbol] += sentiment;
    } else {
      sentimentMap[symbol] = sentiment;
    }
  });

  return sentimentMap;
}

const saveSentiments = async (messages) => {
  const analyses = messages.map(({ message, stock } = message) => analyzer(message, stock));
  
  const sentimentMap = buildSentimentMap(analyses);

  return await saveAndUpdateSentiments(sentimentMap);
}

const getSentiments = async () => {
  const sentimentRecords = await Sentiment.find({});

  return sentimentRecords;
}

exports.saveSentiments = saveSentiments;
exports.getSentiments = getSentiments;
