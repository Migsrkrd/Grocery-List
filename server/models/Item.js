const {Schema, model} = require('mongoose');

const ListItemSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter an item name'],
    },
    quantity: {
        type: Number,
        required: [true, 'Please enter a quantity'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter a price'],
    },
    checked: {
        type: Boolean,
        required: [true, 'Please enter a checked value'],
    },
    list: {
        type: Schema.Types.ObjectId,
        ref: 'List'
    }
});

const ListItem = model('ListItem', ListItemSchema);

module.exports = ListItem;