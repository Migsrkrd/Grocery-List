const {Schema, model} = require('mongoose');

const ListSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name for your list'],
        unique: true,
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ListItem'
        }
    ]
});

const List = model('List', ListSchema);

module.exports = List;