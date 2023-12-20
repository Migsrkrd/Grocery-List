const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/GrocereaseDB');

module.exports = mongoose.connection;