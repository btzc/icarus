const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sentimentSchema = new Schema({
  stock: {
    type: String,
    unique: true
  },
  sentiment: {
    type: Number
  }
});

const Sentiment = mongoose.model('Sentiment', sentimentSchema);

module.exports = {
  Sentiment: Sentiment
};
