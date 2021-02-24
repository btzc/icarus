import React, {
  useState,
  useEffect
} from 'react';

import {
  useParams
} from 'react-router-dom';

import Mention from '../../components/mention/mention.component';

const StockOverview = () => {
  const [mentions, setMentions] = useState([]);
  const { stock } = useParams();

  useEffect(() => {
    const getMentions = async () => {
      try {
        const data = await fetch(`http://localhost:8000/mentions/${stock}`);
        const { mentions } = await data.json();
  
        setMentions(mentions);
      } catch (err) {
        return err;
      }
    }

    getMentions();
  });

  return (
    <div>
      <h1>{ stock }</h1>
      {
        mentions.map(mention =>
          <Mention {...mention} />
      )
      }
    </div>
  );
}

export default StockOverview;
