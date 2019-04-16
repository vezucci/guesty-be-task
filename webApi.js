const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const CONSTANTS = require('./constants');
const timeSetter = require('./middlewares/timeSetter');

let ch = null;

amqp
  .connect(CONSTANTS.RABBITMQ_CONNECTION_STRING)
  .then(conn => conn.createChannel())
  .then(channel => ch = channel);

const app = express();
app.use(bodyParser.json());
app.use(timeSetter);

app.post('/api/notification', (req, res) => {
  const q = CONSTANTS.QUEUE_NAME;
  const msg = JSON.stringify(req.body);
  console.log('got ' + msg);

  ch.assertQueue(q);
  ch.sendToQueue(q, Buffer.from(msg));
  console.log('sent');
  res.send('sent your message');
});

app.listen(5000);

