const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mentionSchema = new Schema({
  mentionId: {
    type: String,
    unique: true
  },
  message: {
    type: String
  },
  username: {
    type: String
  },
  source: {
    type: String
  },
  stock: {
    type: String
  },
  platform: {
    type: String
  },
  date: {
    type: String
  }
});

const Mention = mongoose.model('Mention', mentionSchema);

module.exports = {
  Mention: Mention
};
