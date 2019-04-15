const mongoose = require('mongoose');
const amqp = require('amqplib');

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
const { Schema } = mongoose;

const notificationSchema = new Schema({
  to: String,
  text: String
});

const Notification = mongoose.model('Notification', notificationSchema);

amqp
  .connect('amqp://localhost')
  .then(conn => conn.createChannel())
  .then(ch => {
    const q = 'notifications_queue';
    ch.assertQueue(q);
    console.log('waiting for messages');
    ch.consume(q, msg => {
      const content = JSON.parse(msg.content.toString());
      console.log('got ', content);
      const note = new Notification(content);
      note.save().then(() => {
        ch.ack(msg);
        console.log('saved notification to mongo');
      })  
    })
  })