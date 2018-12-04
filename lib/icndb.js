const axios = require('axios');

module.exports = function () {
  return new Promise((resolve, reject) => {
    query = encodeURIComponent(query);
    const url = `http://api.icndb.com/jokes/random`;

    return axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response) => {
        if (response.value) {
          return resolve(response.value.joke);
        } else {
          return resolve(':( ');
        }
      })
      .catch(err => reject(err));
  });
};
