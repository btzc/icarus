const express = require('express');
const app = express();
const mongoose = require('mongoose');

const stockwits = require('./modules/stocktwits');

const nlpRouter = require('./routes/nlp');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/nlp', nlpRouter);

const saveSentiment = (sentiment) => (
  console.log(sentiment)
);

stockwits.getTrending((res) => saveSentiment(res));

mongoose.connect('mongodb://mongo:27017/icarus', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB is now connected'))
  .catch((err) => console.log(err));

const port = 8000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
