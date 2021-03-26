export function getJSON(url) {
  return fetch(url, {mode: 'cors'})
    .then(function(response) {
      if (!response.ok) {
        throw new Error(`HTTP response has an error: ${response.status}`);
      }
      console.log('Response was OK');
      return response.json();
    })
    .catch(function(err) {
      console.log(err);
    });
}

export const getLocation = function(options) {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};
