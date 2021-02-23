import React, {
  useState,
  useEffect
} from 'react';

import {
  Link
} from 'react-router-dom';

import './stocks.styles.css';

const StocksPage = ({ match }) => {
  const [ sentiments, setSentiments ] = useState([]);
  const [ listening, setListening ] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetch('http://localhost:8000/sentiments/all');
        const { sentiments } = await data.json();
  
        setSentiments(sentiments);
      } catch (err) {
        return err;
      }
    }

    const updateSentiments = (newSentiments) => {
      newSentiments.forEach(newSentiment => {
        const index = sentiments.findIndex(sentiment => sentiment.stock === newSentiment.stock);
        index === -1 ? sentiments.push(newSentiment) : sentiments[index] = newSentiment
      });

      return sentiments;
    }

    const subscribeToSSE = () => {
      if (!listening) {
        const events = new EventSource('http://localhost:8000/events/sentiments');
        events.onmessage = (event) => {
          const newSentiments = JSON.parse(event.data);
          const updatedSentiments = updateSentiments(newSentiments);

          setSentiments(updatedSentiments);
        };
  
        setListening(true);
      }
    }

    getData();
    subscribeToSSE();
  }, [listening, sentiments]);

  return (
    <div>
      <table className="stats-table">
        <thead>
          <tr>
            <th>Stocks</th>
            <th>Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {
            sentiments.map(sentiment =>
              <tr key={sentiment.stock}>
                <td>
                  <Link to={`${match.url}/${sentiment.stock}`}>
                    { sentiment.stock }                
                  </Link>
                </td>
                <td>
                  { sentiment.sentiment }
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  );
}

export default StocksPage;
