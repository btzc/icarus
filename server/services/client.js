const crypto = require('crypto');

const clients = {};

const set = (client, source) => {
  if (clients[source]) {
    clients[source][client.id] = client.res;
  } else {
    clients[source] = {};
    clients[source][client.id] = client.res;
  }
}

const remove = (clientId, source) => delete clients[source][clientId];

const generateClientUUID = async () => {
  const buffer = await crypto.randomBytes(16);
  const token = buffer.toString('hex');
  
  return token;
}

const createClient = (res, clientId) => ({
  id: clientId,
  res: res
});

const handleNewClient = async (req, res, source) => {
  const clientId = await generateClientUUID();
  const client = createClient(res, clientId);
  set(client, source);

  console.log(`Client ${clientId} just connected!`);

  req.on('close', () => {
    remove(clientId, source);
    console.log(`closing connection for Client ${clientId}`);
  });
};

const getAll = () => clients;

exports.handleNewClient = handleNewClient;
exports.getAll = getAll;
