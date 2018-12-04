const axios = require('axios');

module.exports = function (query, key) {
  return new Promise((resolve, reject) => {
    query = encodeURIComponent(query);
    const url = `https://api.tenor.com/v1/search?q=${ query }&key=${ key }&limit=25&locale=hu_HU&media_filter=minimal&contentfilter=low`;

    return axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(({ data: { results } }) => {
        if (results && results.length) {
          const random = results[ Math.floor(Math.random() * results.length) ];
          return resolve(random.media.gif.url);
        } else {
          return resolve('Sajnos nincs ilyen GIF... :( ');
        }
      })
      .catch(err => reject(err));
  });
};
