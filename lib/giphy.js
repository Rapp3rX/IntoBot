const axios = require('axios');

module.exports = function (query, key) {
  return new Promise((resolve, reject) => {
    query = encodeURIComponent(query);
    const url = `https://api.giphy.com/v1/gifs/search?q=${ query }&api_key=${ key }`;

    return axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(({ data: { data } }) => {
        if (data && data.length) {
          console.log(Math.floor(Math.random() * data.length));
          const random = data[ Math.floor(Math.random() * data.length) ];
          console.log(random);
          return resolve(random.images.original_still.url);
        } else {
          return resolve('Sajnos nincs ilyen GIF... :( ');
        }
      })
      .catch(err => {
        console.error(err); reject(err);});
  });
};
