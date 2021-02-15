const express = require('express');
const app = express();
const mongoose = require('mongoose');
const schedule = require('node-schedule');

const stockwits = require('./modules/stocktwits');

const nlpRouter = require('./routes/nlp');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/nlp', nlpRouter);

schedule.scheduleJob('*/1 * * * *', function() {
  console.log('running job');
  stockwits.getTrending();
});

mongoose.connect('mongodb://mongo:27017/icarus', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB is now connected'))
  .catch((err) => console.log(err));

const port = 8000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
