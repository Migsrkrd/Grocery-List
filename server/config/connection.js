const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI || 'https://grocease-graphql.onrender.com');

module.exports = mongoose.connection;