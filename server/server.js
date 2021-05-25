const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const schedule = require('node-schedule');

const stocktwits = require('./services/stocktwits');

const sentimentRouter = require('./routes/sentiment');
const eventsRouter = require('./routes/event');
const mentionsRouter = require('./routes/mention');

schedule.scheduleJob('*/30 * * * * *', function() {
  stocktwits.getTrending();
});

mongoose.connect('mongodb://mongo:27017/icarus', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB is now connected'))
  .catch((err) => console.log(err));

const port = 8000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/sentiments', sentimentRouter);
app.use('/events', eventsRouter);
app.use('/mentions', mentionsRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
