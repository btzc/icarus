const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const stopWords = require('stopword');

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

exports.buildSentimentMap = buildSentimentMap;
exports.analyzer = analyzer;
