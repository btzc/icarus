const crypto = require('crypto');

const generateClientUUID = async () => {
  const buffer = await crypto.randomBytes(24);
  const token = buffer.toString('hex');
  
  return token;
}

exports.generateClientUUID = generateClientUUID;
