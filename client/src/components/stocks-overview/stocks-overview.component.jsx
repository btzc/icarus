import React, {
  useState,
  useEffect
} from 'react';

import {
  Link,
  useRouteMatch
} from 'react-router-dom';

import './stocks.styles.css';

const StocksPage = () => {
  const [ sentiments, setSentiments ] = useState([]);
  const [ listening, setListening ] = useState(false);

  const match = useRouteMatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetch('http://localhost:8000/sentiments/all');
        const json = await data.json();
  
        setSentiments(json.sentiments);
      } catch (err) {
        return err;
      }
    }

    getData();
  }, []);

  useEffect(() => {
    const updateSentiments = (newSentiments) => {
      const oldSentiments = [...sentiments];

      newSentiments.forEach(newSentiment => {
        const index = oldSentiments.findIndex(oldSentiment => oldSentiment.stock === newSentiment.stock);
        index === -1 ? oldSentiments.push(newSentiment) : oldSentiments[index] = newSentiment;
      });

      return oldSentiments;
    }

    if (sentiments.length === 0) return; 

    const events = new EventSource('http://localhost:8000/events/sentiments');

    events.onmessage = (event) => {
      const newSentiments = JSON.parse(event.data);
      const updatedSentiments = updateSentiments(newSentiments);

      setSentiments(updatedSentiments);
    };

    return () => {
      events.close();
    }
  }, [sentiments]);

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
