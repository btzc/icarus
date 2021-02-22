import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [ sentiments, setSentiments ] = useState([]);
  const [ listening, setListening ] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const data = await fetch('http://localhost:8000/sentiments/all');
      const { sentiments } = await data.json();

      setSentiments(sentiments);
    }

    const updateSentiments = (newSentiments) => {
      newSentiments.forEach(newSentiment => {
        const index = sentiments.findIndex(sentiment => sentiment.stock === newSentiment.stock);
        index === -1 ? sentiments.push(newSentiment) : sentiments[index] = newSentiment
      });

      return sentiments;
    }

    const subscribeToSSE = async () => {
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
    <React.Fragment>
      <table className="stats-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Sentiment</th>
          </tr>
        </thead>
        <tbody>
          {
            sentiments.map(sentiment =>
              <tr key={sentiment.stock}>
                <td>{ sentiment.stock }</td>
                <td>{ sentiment.sentiment }</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </React.Fragment>
  );
}

export default App;
