import React, {
  useState,
  useEffect
} from 'react';

import {
  useParams
} from 'react-router-dom';

import Button from '@material-ui/core/Button';

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
  }, [stock]);

  useEffect(() => {
    if (mentions.length === 0) return;

    const events = new EventSource(`http://localhost:8000/events/mentions/${stock}`)

    events.onmessage = (event) => {
      const newMentions = JSON.parse(event.data);

      setMentions(newMentions);
    };

    return () => {
      events.close();
    }
  }, [mentions, stock]);

  return (
    <div>
      <Button>Back</Button>
      <h1>{ stock }</h1>
      {
        mentions.map(mention =>
          <Mention
            key={mention.mentionId}
            {...mention}
          />
      )
      }
    </div>
  );
}

export default StockOverview;
