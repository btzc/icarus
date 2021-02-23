import React from 'react';

import {
  useParams
} from "react-router-dom";

const Stock = ({ match }) => {
  console.log(match);
  const { stock } = match.params;

  return (
    <div>
      { stock }
    </div>
  );
}

export default Stock;
