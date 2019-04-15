const express = require('express');
const bodyParser = require('body-parser');
const amqp = require('amqplib');

const app = express();
app.use(bodyParser.json());

let connection = null,
    ch = null;

app.post('/api/notification', (req, res) => {
  const q = 'notifications_queue';
  const msg = JSON.stringify(req.body);
  console.log('got ' + msg);

  ch.assertQueue(q);
  ch.sendToQueue(q, Buffer.from(msg));
  console.log('sent');
  res.send('sent your message');
});

app.listen(5000, async () => {
  connection = await amqp.connect('amqp://localhost');
  ch = await connection.createChannel();
  console.log('established connection');
});

