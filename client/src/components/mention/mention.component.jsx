import React from 'react';

const Mention = ({ mentionId, message, username, platform, date}) => (
  <div>
    <p>Username: { username }</p>
    <p>Date: { date }</p>
    <p>Platform: { platform }</p>
    <p>Url: {`https://stocktwits.com/${username}/message/${mentionId}`}</p>
    <p>Message: { message.replace('&#39;', '\'') }</p>
  </div>
);

export default Mention
