import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [ sentiments, setSentiments ] = useState([]);
  const [ listening, setListening ] = useState(false);

  useEffect( () => {
    if (!listening) {
      const events = new EventSource('http://localhost:8000/events/sentiments');
      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log(parsedData);
        setSentiments((sentiments) => [...sentiments, ...parsedData]);
      };

      setListening(true);
    }
  }, [listening, sentiments]);

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Stock</th>
          <th>Eggs</th>
          <th>Temperature</th>
        </tr>
      </thead>
      <tbody>
        {
          sentiments.map((sentiment, i) =>
            <tr key={i}>
              <td>{ sentiment.stock }</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}

export default App;
