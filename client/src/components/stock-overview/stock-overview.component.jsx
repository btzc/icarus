import React, {
  useState,
  useEffect
} from 'react';

import {
  useParams
} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

import Mention from '../../components/mention/mention.component';

import './stock-overview.styles.css';

const StockOverview = () => {
  const [mentions, setMentions] = useState([]);
  const [page, setPage] = useState(1);
  const [isBottom, setIsBottom] = useState(false);
  const [newMentions, setNewMentions] = useState(false);

  const { stock } = useParams();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  });

  const getMentions = async () => {
    try {
      setPage(page + 1);

      const response = await fetch(`http://localhost:8000/mentions/${stock}?page=${page}`);
      const data = await response.json();
      const newMentions = data.mentions;

      setMentions([...mentions, ...newMentions]);
      setIsBottom(false);
    } catch (err) {
      return err;
    }
  }

  useEffect(() => {
    if (isBottom) {
      setIsBottom(false);
      getMentions();
    }
  }, [isBottom, getMentions]);

  useEffect(() => {
    getMentions();
  }, [stock]);

  useEffect(() => {
    if (mentions.length === 0) return;

    const events = new EventSource(`http://localhost:8000/events/mentions/${stock}`);

    events.onmessage = () => {
      setNewMentions(true);
    };

    return () => {
      events.close();
    }
  }, [stock, mentions]);

  const handleScroll = () => {
    const scrollTop = (document.documentElement
      && document.documentElement.scrollTop)
      || document.body.scrollTop;
    const scrollHeight = (document.documentElement
      && document.documentElement.scrollHeight)
      || document.body.scrollHeight;
    if (scrollTop + window.innerHeight + 50 >= scrollHeight){
      setIsBottom(true);
    }
  }

  const scrollToTop = () => window.scrollTo(0,0);

  const getNewMentions = async () => {
    scrollToTop();
    setPage(1);
    try {
      const response = await fetch(`http://localhost:8000/mentions/${stock}?page=${page}`);
      const data = await response.json();
      const fetchedMentions = data.mentions;
  
      setMentions(fetchedMentions);
      setNewMentions(false);
    } catch (err) {
      return err
    }
  }

  return (
    <div>
        { 
          newMentions && 
            <div className="pill">
              <Chip 
                color="primary"
                label="New Mentions"
                onClick={getNewMentions}
              />
            </div>
        }
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
