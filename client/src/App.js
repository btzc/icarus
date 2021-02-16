import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [ nests, setNests ] = useState([]);
  const [ listening, setListening ] = useState(false);

  useEffect( () => {
    if (!listening) {
      const events = new EventSource('http://localhost:8000/events');
      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        setNests((nests) => nests.concat(parsedData));
      };

      setListening(true);
    }
  }, [listening, nests]);

  return (
    <table className="stats-table">
      <thead>
        <tr>
          <th>Momma</th>
          <th>Eggs</th>
          <th>Temperature</th>
        </tr>
      </thead>
      <tbody>
        {
          nests.map((nest, i) =>
            <tr key={i}>
              <td>{nest.momma}</td>
              <td>{nest.eggs}</td>
              <td>{nest.temperature} ℃</td>
            </tr>
          )
        }
      </tbody>
    </table>
  );
}

export default App;
