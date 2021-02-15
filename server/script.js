const snoowrap = require('snoowrap');

const scrapeSubreddit = async () => {
  const r = new snoowrap({
    userAgent: 'Icarus/0.1',
    clientId: 'H2OvlNSpTMShiQ',
    clientSecret: 'OTtLDzQtCqgwCqRbpnmnqUuGMRpA7g',
    username: 'btzc',
    password: 'Tictac97!'
  });

  try {
    const subreddit = await r.getSubreddit('WallStreetBets');
    const topPosts = await subreddit.getTop({time: 'week', limit: 100});
    let data = [];

    topPosts.forEach((post) => {
      data.push({
        link: post.url,
        text: post.title,
        score: post.score
      });

      const words = post.title.split(' ');
      const tags = words.filter(word => word.toLowerCase().startsWith('$'));

      console.log(tags);
    });
    
    return data;
  } catch(e) {
    console.log(e);
  }
};

const posts = scrapeSubreddit();
