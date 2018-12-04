const axios = require('axios');

module.exports = function (name="") {
  return new Promise((resolve, reject) => {
    name = encodeURIComponent(name);
    const url = `http://api.icndb.com/jokes/random?firstName=${ name }&lastName=`;

    return axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response) => {
      return resolve(response.value.joke);
        if (response.value != undefined) {
          return resolve(response.value.joke);
        } else {
          return resolve(':( ');
        }
      })
      .catch(err => reject(err));
  });
};
