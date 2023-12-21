const {Schema, model} = require('mongoose');

const ListItemSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter an item name'],
    },
    description: {
        type: String,
        required: false,
    },
    quantity: {
        type: Number,
        required: [true, 'Please enter a quantity'],
    },
    list: {
        type: Schema.Types.ObjectId,
        ref: 'List'
    }
});

const ListItem = model('ListItem', ListItemSchema);

module.exports = ListItem;