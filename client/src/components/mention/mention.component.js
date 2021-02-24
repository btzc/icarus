import React from 'react';

const Mention = ({ mentionId, message, username, source, platform, date}) => (
  <div>
    <p>Username: { username }</p>
    <p>Date: { date }</p>
    <p>Platform: { platform }</p>
    <p>Url: {` ${source}/${username}/message/${mentionId}`}</p>
    <p>Message: { message.replace('&#39;', '\'') }</p>
  </div>
);

export default Mention
