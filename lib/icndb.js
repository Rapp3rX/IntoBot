const axios = require('axios');

module.exports = function (name="") {
  return new Promise((resolve, reject) => {
    //name = encodeURIComponent(name);
    const url = `https://api.icndb.com/jokes/random?firstName=${ name }&lastName=`;

    return axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then((response) => {
        if (response.data.value != undefined) {
          return resolve(response.data.value.joke);
        } else {
          return resolve(`Biztos vagyok benne, hogy ${ name } nem akar több viccet hallani!`);
        }
      })
      .catch(err => reject(err));
  });
};
