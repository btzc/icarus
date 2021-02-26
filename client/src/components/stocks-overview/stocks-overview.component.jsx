import React, {
  useState,
  useEffect
} from 'react';

import {
  Link,
  useRouteMatch
} from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/lab/Pagination';

const StocksPage = () => {
  const [ sentiments, setSentiments ] = useState([]);
  const [ page, setPage ] = useState(1);
  const [ totalPages, setTotalPages ] = useState(0);

  const match = useRouteMatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetch(`http://localhost:8000/sentiments/all?page=${page}`);
        const json = await data.json()
  
        setSentiments(json.documents);
        setTotalPages(calculateTotalPages(json.totalDocuments));

      } catch (err) {
        return err;
      }
    }

    getData();
  }, [page]);

  useEffect(() => {
    const sortSentiments = (sentiments) => sentiments.sort((a, b) => b.sentiment - a.sentiment);

    const updateSentiments = (newSentiments) => {
      const oldSentiments = [...sentiments];

      newSentiments.forEach(newSentiment => {
        const index = oldSentiments.findIndex(oldSentiment => oldSentiment.stock === newSentiment.stock);
        if (index !== -1) {
          oldSentiments[index] = newSentiment;
        }
      });

      return oldSentiments;
    }

    if (sentiments.length === 0) return; 

    const events = new EventSource('http://localhost:8000/events/sentiments');

    events.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const updatedSentiments = updateSentiments(data.documents);
      const sortedSentiments = sortSentiments(updatedSentiments);

      setSentiments(sortedSentiments);
      setTotalPages(calculateTotalPages(data.totalDocuments));
    };

    return () => {
      events.close();
    }
  }, [sentiments]);

  const calculateTotalPages = totalDocuments => Math.ceil(totalDocuments / 50);

  const handlePageChange = (event, value) => {

    setPage(value);
    window.scrollTo(0, 0)
  }

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Stocks</TableCell>
              <TableCell>Sentiment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              sentiments.map(sentiment =>
                <TableRow key={sentiment.stock}>
                  <TableCell>
                    <Link to={`${match.url}/${sentiment.stock}`}>
                      { sentiment.stock }                
                    </Link>
                  </TableCell>
                  <TableCell>
                    { sentiment.sentiment }
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        onChange={handlePageChange}
      />
    </React.Fragment>
  );
}

export default StocksPage;
