const mongoose = require('mongoose');
const amqp = require('amqplib');
const request = require('requestretry');

require('./models/Notification');
const CONSTANTS = require('./constants');

mongoose.connect(CONSTANTS.MONGO_CONNECTION_STRING, {useNewUrlParser: true});
const Notification = mongoose.model('Notification');

amqp
  .connect(CONSTANTS.RABBITMQ_CONNECTION_STRING)
  .then(conn => conn.createChannel())
  .then(ch => {
    const q = CONSTANTS.QUEUE_NAME;
    ch.assertQueue(q);
    console.log('waiting for messages');
    ch.consume(q, msg => {
      const content = JSON.parse(msg.content.toString());
      console.log('got ', content);
      const note = new Notification(content);
      note.save().then(() => {
        ch.ack(msg);
        console.log('saved notification to mongo');
        sendNotification({text: Math.random().toString(), to: 'vetal'});
      })  
    })
  })

  function sendNotification(note) {
    request({
      url: 'http://localhost:5000/api/notification',
      json: true,
      method: 'POST',
      maxAttempts: 10,
      retryDelay: 1000,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
      body: note 
    }, function(err, response, body){
      if (response) {
        console.log('The number of request attempts: ' + response.attempts);
      }
    });
  }