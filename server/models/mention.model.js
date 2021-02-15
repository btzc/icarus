const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mentionSchema = new Schema({
  mentionId: {
    type: String,
    unique: true
  },
  stock: {
    type: String
  },
  source: {
    type: String
  },
  message: {
    type: String
  }
});

const Mention = mongoose.model('Mention', mentionSchema);

module.exports = {
  Mention: Mention
};
