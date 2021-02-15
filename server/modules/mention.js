const Mention = require('../models/mention.model').Mention;

const saveMention = async ({ id, body, symbols }, source) => {
  const mentionRecord = await Mention.findOne({ mentionId: id });

  if (!mentionRecord) {
    const savedDocument = await new Mention({
      mentionId: id,
      message: body,
      stock: symbols[0].symbol,
      source: source
    }).save();

    return savedDocument;
  }
}

const saveMentions = async (messages, source) => (
  await (
    await Promise.all(
      messages.map(
        async (message) => await saveMention(message, source)
      )
    )
  ).filter(message => message !== undefined)
);

exports.saveMentions = saveMentions;
