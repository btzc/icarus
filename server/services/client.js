const crypto = require('crypto');

const clients = {};

const set = client => clients[client.id] = client.res;

const remove = (clientId) => delete clients[clientId];

const generateClientUUID = async () => {
  const buffer = await crypto.randomBytes(16);
  const token = buffer.toString('hex');
  
  return token;
}

const createClient = (res, clientId) => ({
  id: clientId,
  res: res
});

const handleNewClient = async (req, res) => {
  const clientId = await generateClientUUID();
  const client = createClient(res, clientId);
  set(client);

  console.log(`Client ${clientId} just connected!`);

  req.on('close', () => {
    remove(clientId);
  });
};

const getAll = () => clients;

exports.handleNewClient = handleNewClient;
exports.getAll = getAll;
