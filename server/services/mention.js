const Mention = require('../models/mention.model').Mention;

const saveMention = async ({ id, body, user, source, symbols, created_at }, platform) => {
  const mentionRecord = await Mention.findOne({ mentionId: id });

  if (!mentionRecord) {
    const savedDocument = await new Mention({
      mentionId: id,
      message: body,
      username: user.username,
      source: source.url,
      stock: symbols[0].symbol,
      platform: platform,
      date: created_at
    }).save();

    return savedDocument;
  }
}

const saveMentions = async (messages, platform) => (
  await (
    await Promise.all(
      messages.map(
        async (message) => await saveMention(message, platform)
      )
    )
  ).filter(message => message !== undefined)
);

exports.saveMentions = saveMentions;
