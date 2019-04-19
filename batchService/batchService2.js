const express = require('express');
const request = require('request-promise-native');
const bodyParser = require('body-parser');

const bodyFormat = {
  "endpoint": {
    "url": "https://guesty-user-service.herokuapp.com/user/{userId}",
    "method": "PUT"
  }, 
  "params": [
    {
      "pathParams": [ { "key": "{userId}", "value": "ja2S-hs81-ksn3-iQI9" } ],
      "requestBody": { "age": 30 }
    },
    {
      "pathParams": [ { "key": "{userId}", "value": 99 } ],
      "requestBody": { "age": 30 }
    },
    {
      "pathParams": [ { "key": "{userId}", "value": 103 } ],
      "requestBody": { "age": 30 }
    }
  ]
}

const app = express();
app.use(bodyParser.json());

app.post('/batch', async (req, res) => {
  const task = req.body;

  const requests = [];
  for(let param of task.params) {

    const urlWithParams = param.pathParams.reduce((acc, cur) => {
      return acc.replace(cur.key, cur.value);
    }, task.endpoint.url);

    requests.push(makeRequestResolved(task.endpoint.method, urlWithParams, param.requestBody));
  };

  const results = await Promise.all(requests); 
  res.send(results.map(r => r.statusCode));
});

function makeRequestResolved(method, url, body, n = 1) {
  return request({
    url: url,
    method: method,
    body: JSON.stringify(body),
    resolveWithFullResponse: true
  })
  .then(response => Promise.resolve(response))
  .catch(err => {
    if (n > 0) {
      console.log('retrying');
      return makeRequestResolved(method, url, body, n - 1)
    }
    return Promise.resolve(err);
  });
}

app.listen(5000);