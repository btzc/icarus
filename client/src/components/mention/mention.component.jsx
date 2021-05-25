import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './mention.styles.css';

const Mention = ({ mentionId, message, username, platform, date}) => (
  <Card className="card">
    <CardContent>
      <Typography>
        Username: { username }
      </Typography>
      <Typography>
        Platform: { platform }
      </Typography>
      <Typography>
        Date: { date = new Date(date).toLocaleDateString(undefined, {day:'2-digit'}) + '-' + new Date(date).toLocaleDateString(undefined, {month:'short'}) + '-' + new Date(date).toLocaleDateString(undefined, {year:'numeric'}) }
      </Typography>
      <Typography>
        Url: {`https://stocktwits.com/${username}/message/${mentionId}`}
      </Typography>
      <Typography>
        Message: { 
          message.replace(/&#(\d+);/g, function(match, dec) {
            if (match) {
              return String.fromCharCode(dec);
            }
          })
        }
      </Typography>
    </CardContent>
  </Card>
);

export default Mention
