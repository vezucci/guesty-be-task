const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  to: String,
  text: String,
  time: Date
});

mongoose.model('Notification', notificationSchema);
