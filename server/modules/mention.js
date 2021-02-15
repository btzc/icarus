const Mention = require('../models/mention.model').Mention;

const saveMention = async ({ id, body, symbols }, source) => {
  const mentionRecord = await Mention.findOne({ mentionId: id });

  if (!mentionRecord) {
    await new Mention({
      mentionId: id,
      message: body,
      stock: symbols[0].symbol,
      source: source
    }).save();
  }
}

const saveMentions = (messages, source) => {
  messages.forEach(message => saveMention(message, source));
}

exports.saveMentions = saveMentions;
