const clients = {};

const set = client => clients[client.id] = client.res;

const getAll = () => clients;

const remove = (clientId) => delete clients[clientId];

exports.set = set;
exports.getAll = getAll;
exports.remove = remove;
