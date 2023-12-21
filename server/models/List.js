const {Schema, model} = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ListSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name for your list'],
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ListItem'
        }
    ],
    isSent: {
        type: Boolean,
        default: false,
    },
    sentTo: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    userId:{
        type: String,
        required: true,
    }
});

const List = model('List', ListSchema);

module.exports = List;