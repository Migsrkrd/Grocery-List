const {Schema, model} = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const NotificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        get: timestamp => dateFormat(timestamp)
    }
});

const Notification = model('Notification', NotificationSchema);

module.exports = Notification;

