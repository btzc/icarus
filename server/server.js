const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const schedule = require('node-schedule');
const Memcached = require('memcached');

const stocktwits = require('./services/stocktwits');

const sentimentRouter = require('./routes/sentiment');

// schedule.scheduleJob('*/1 * * * *', function() {
//   console.log('running job');
//   stocktwits.getTrending();
// });

const memcached = new Memcached('memcached:11211');
memcached.set('foo', 'bar', 10, function (err) { if (err) console.log(err) });
memcached.gets('foo', function (err, data) {
  console.log(data.foo);
});


mongoose.connect('mongodb://mongo:27017/icarus', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB is now connected'))
  .catch((err) => console.log(err));

let clients = [];
let nests = [];

function eventsHandler(req, res) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);
  res.write('hello there!');

  const data = `data: ${JSON.stringify(nests[0])}\n\n`;
  res.write(data);

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  console.log(clients.length);

  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(c => c.id !== clientId);
  });
}
// Iterate clients list and use write res object method to send new nest
function sendEventsToAll(newNest) {
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(newNest)}\n\n`));
}
// Middleware for POST /nest endpoint
async function addNest(req, res) {
  const newNest = req.body
  nests.push(newNest);

  res.json(newNest);

  return sendEventsToAll(newNest);
}

const port = 8000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/sentiments', sentimentRouter);

app.post('/nest', addNest);
app.get('/events', eventsHandler);
app.get('/status', (req, res) => res.json({clients: clients.length}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
