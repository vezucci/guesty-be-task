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
  const results = [];
  const requests = [];
  for(let param of task.params) {
    //const url = task.endpoint.url.replace(`{userId}`, param.userId);

    const urlWithParams = param.pathParams.reduce((acc, cur) => {
      return acc.replace(cur.key, cur.value);
    }, task.endpoint.url);

    try {
      // const result = await request({
      //   url: url,
      //   method: task.endpoint.method,
      //   body: JSON.stringify(param.requestBody)
      // });
      const result = await makeRequest(task.endpoint.method, urlWithParams, param.requestBody);
      results.push(result);
    } catch (err) {
      console.log(err);
    }
    
  };
  console.log(results);
  res.send('done')
});

function makeRequest(method, url, body) {
  return request({
    url: url,
    method: method,
    body: JSON.stringify(body)
  })
}

app.listen(5000);